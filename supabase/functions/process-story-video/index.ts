import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { FFmpeg } from 'https://esm.sh/@ffmpeg/ffmpeg@0.12.7'
import { fetchFile, toBlobURL } from 'https://esm.sh/@ffmpeg/util@0.12.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting video processing...')
    const { imageUrl, audioUrl, outputFileName, aspectRatio } = await req.json()
    
    if (!imageUrl || !audioUrl || !outputFileName || !aspectRatio) {
      console.error('Missing required parameters:', { imageUrl, audioUrl, outputFileName, aspectRatio })
      throw new Error('Missing required parameters for video processing')
    }

    console.log('Parameters received:', { imageUrl, audioUrl, outputFileName, aspectRatio })

    // Initialize FFmpeg
    const ffmpeg = new FFmpeg()
    console.log('FFmpeg instance created')

    // Load FFmpeg with explicit core version
    console.log('Loading FFmpeg core...')
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })
    console.log('FFmpeg core loaded successfully')

    // Download files with error handling
    console.log('Downloading input files...')
    try {
      const imageResponse = await fetch(imageUrl)
      const audioResponse = await fetch(audioUrl)
      
      if (!imageResponse.ok || !audioResponse.ok) {
        throw new Error('Failed to download input files')
      }

      const imageBuffer = new Uint8Array(await imageResponse.arrayBuffer())
      const audioBuffer = new Uint8Array(await audioResponse.arrayBuffer())

      // Write files to FFmpeg's virtual filesystem
      console.log('Writing files to FFmpeg filesystem...')
      await ffmpeg.writeFile('input.png', imageBuffer)
      await ffmpeg.writeFile('audio.mp3', audioBuffer)
      console.log('Files written successfully')
    } catch (downloadError) {
      console.error('Error downloading or writing input files:', downloadError)
      throw new Error(`Failed to process input files: ${downloadError.message}`)
    }

    // Calculate dimensions based on aspect ratio
    const dimensions = aspectRatio === '16:9' ? '1920:1080' : '1080:1920'
    console.log(`Using dimensions: ${dimensions} for aspect ratio: ${aspectRatio}`)

    // Execute FFmpeg command with improved error handling
    console.log('Executing FFmpeg command...')
    try {
      await ffmpeg.exec([
        '-loop', '1',
        '-i', 'input.png',
        '-i', 'audio.mp3',
        '-c:v', 'libx264',
        '-preset', 'medium', // Balance between speed and quality
        '-tune', 'stillimage',
        '-crf', '23', // Better quality
        '-c:a', 'aac',
        '-b:a', '192k',
        '-pix_fmt', 'yuv420p',
        '-shortest',
        '-vf', `scale=${dimensions}:force_original_aspect_ratio=decrease,pad=${dimensions}:(ow-iw)/2:(oh-ih)/2`,
        '-movflags', '+faststart', // Enable streaming
        'output.mp4'
      ])
      console.log('FFmpeg command executed successfully')
    } catch (ffmpegError) {
      console.error('FFmpeg command execution error:', ffmpegError)
      throw new Error(`FFmpeg command failed: ${ffmpegError.message}`)
    }

    // Read the output file
    console.log('Reading output video file...')
    const outputData = await ffmpeg.readFile('output.mp4')
    const videoBuffer = new Uint8Array(outputData)

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Upload the final video
    console.log('Uploading final video...')
    const { error: uploadError } = await supabaseClient.storage
      .from('story-videos')
      .upload(outputFileName, videoBuffer, {
        contentType: 'video/mp4',
        cacheControl: '3600'
      })

    if (uploadError) {
      console.error('Video upload error:', uploadError)
      throw new Error(`Failed to upload video: ${uploadError.message}`)
    }

    console.log('Video processing completed successfully')
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing video:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})