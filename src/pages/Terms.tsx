import { NavigationBar } from "@/components/NavigationBar";

const Terms = () => {
  return (
    <>
      <NavigationBar />
      <div className="container mx-auto px-4 py-8 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
        <h1 className="text-3xl font-bold mb-8">Terms of Service & Privacy Policy</h1>
        
        {/* Terms of Service Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
          <p>Welcome to our platform. By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">1. User Agreement</h3>
          <p>By using our service, you agree to:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Accept responsibility for all activities that occur under your account</li>
            <li>Not use the service for any illegal purposes</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2. Content Guidelines</h3>
          <p>Users are responsible for the content they generate and share. Content must not:</p>
          <ul>
            <li>Violate any laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Contain harmful or malicious code</li>
            <li>Include inappropriate or offensive material</li>
          </ul>
        </section>

        {/* Privacy Policy Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
          <p>This Privacy Policy describes how we collect, use, and handle your personal information.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">1. Information Collection</h3>
          <p>We collect information that you provide directly to us:</p>
          <ul>
            <li>Account information (name, email, password)</li>
            <li>Profile information</li>
            <li>Content you create and share</li>
            <li>Communication preferences</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2. Use of Information</h3>
          <p>We use the collected information to:</p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Improve user experience</li>
            <li>Send important notifications</li>
            <li>Prevent fraud and abuse</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3. Data Protection</h3>
          <p>We implement appropriate security measures to protect your personal information:</p>
          <ul>
            <li>Encryption of sensitive data</li>
            <li>Regular security assessments</li>
            <li>Limited access to personal information</li>
            <li>Secure data storage practices</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4. Your Rights</h3>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>If you have any questions about these Terms or Privacy Policy, please contact us at:</p>
          <p>Email: support@drsurreal.art</p>
        </section>
      </div>
    </>
  );
};

export default Terms;