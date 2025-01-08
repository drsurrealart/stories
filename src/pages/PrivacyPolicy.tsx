import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationBar } from "@/components/NavigationBar";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar onLogout={() => {}} />
      <div className="container mx-auto py-8 px-4 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <ScrollArea className="h-[calc(100vh-300px)] pr-4">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground">
                Welcome to LearnMorals.com. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information when you use our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Account information (email address, name)</li>
                <li>Generated stories and preferences</li>
                <li>Payment information (processed securely by our payment provider)</li>
                <li>Usage data and analytics</li>
                <li>Communications with our support team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To provide and maintain our service</li>
                <li>To process your payments and subscriptions</li>
                <li>To improve our story generation algorithms</li>
                <li>To communicate with you about service updates</li>
                <li>To provide customer support</li>
                <li>To detect and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Data Storage and Security</h2>
              <p className="text-muted-foreground">
                We use industry-standard security measures to protect your data. Our services are hosted on secure servers, and we regularly update our security practices to ensure your information remains protected.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Third-Party Services</h2>
              <p className="text-muted-foreground">
                We use trusted third-party services for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Payment processing</li>
                <li>Email communications</li>
                <li>Analytics</li>
                <li>Story generation AI services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
              <p className="text-muted-foreground">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at support@learnmorals.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Updates to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.
              </p>
            </section>

            <p className="text-sm text-muted-foreground mt-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PrivacyPolicy;