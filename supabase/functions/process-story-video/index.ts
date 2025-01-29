import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { FFmpeg } from 'https://esm.sh/@ffmpeg/ffmpeg@0.11.0'
import { fetchFile, toBlobURL } from 'https://esm.sh/@ffmpeg/util@0.11.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl, audioUrl, outputFileName, aspectRatio } = await req.json()
    console.log('Starting FFmpeg processing:', { imageUrl, audioUrl, outputFileName })

    // Initialize FFmpeg
    const ffmpeg = new FFmpeg()
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/umd'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })
    console.log('FFmpeg loaded successfully')

    // Download files
    console.log('Downloading input files...')
    const imageFile = await fetchFile(imageUrl)
    const audioFile = await fetchFile(audioUrl)

    // Write files to FFmpeg's virtual filesystem
    console.log('Writing files to FFmpeg filesystem...')
    await ffmpeg.writeFile('input.png', imageFile)
    await ffmpeg.writeFile('audio.mp3', audioFile)

    // Calculate dimensions based on aspect ratio
    const dimensions = aspectRatio === '16:9' ? '1920:1080' : '1080:1920'
    console.log(`Using dimensions: ${dimensions} for aspect ratio: ${aspectRatio}`)

    // Execute FFmpeg command to create video
    console.log('Executing FFmpeg command...')
    await ffmpeg.exec([
      '-loop', '1',
      '-i', 'input.png',
      '-i', 'audio.mp3',
      '-c:v', 'libx264',
      '-tune', 'stillimage',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-pix_fmt', 'yuv420p',
      '-shortest',
      '-vf', `scale=${dimensions}:force_original_aspect_ratio=decrease,pad=${dimensions}:(ow-iw)/2:(oh-ih)/2`,
      'output.mp4'
    ])
    console.log('FFmpeg command executed successfully')

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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})