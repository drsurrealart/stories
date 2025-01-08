import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationBar } from "@/components/NavigationBar";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar onLogout={handleLogout} />
      <div className="container mx-auto py-8 px-4 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Terms of Service & Privacy Policy</h1>
        <ScrollArea className="h-[calc(100vh-300px)] pr-4">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">Terms of Service</h2>
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h3>
                  <p className="text-muted-foreground">
                    By accessing and using LearnMorals.com, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the service.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">2. Description of Service</h3>
                  <p className="text-muted-foreground">
                    LearnMorals.com provides an AI-powered story generation service that creates personalized stories with moral lessons. Our service includes both free and premium features accessible through various subscription tiers.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">3. User Accounts</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>You must provide accurate and complete information when creating an account</li>
                    <li>You are responsible for maintaining the security of your account</li>
                    <li>You must not share your account credentials</li>
                    <li>You must notify us immediately of any unauthorized access</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">4. Subscription Terms</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Subscriptions are billed in advance on a monthly or yearly basis</li>
                    <li>You can cancel your subscription at any time</li>
                    <li>Refunds are handled on a case-by-case basis</li>
                    <li>We reserve the right to modify subscription prices with notice</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">5. Content and Copyright</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Generated stories are for personal use only</li>
                    <li>You may not redistribute or sell generated content</li>
                    <li>We retain rights to the story generation technology</li>
                    <li>You retain rights to your personal information and preferences</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">6. Acceptable Use</h3>
                  <p className="text-muted-foreground">
                    You agree not to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Use the service for any unlawful purpose</li>
                    <li>Attempt to gain unauthorized access to any part of the service</li>
                    <li>Interfere with or disrupt the service</li>
                    <li>Generate inappropriate or harmful content</li>
                  </ul>
                </section>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Privacy Policy</h2>
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold mb-3">1. Information We Collect</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Account information (email address, name)</li>
                    <li>Generated stories and preferences</li>
                    <li>Payment information (processed securely by our payment provider)</li>
                    <li>Usage data and analytics</li>
                    <li>Communications with our support team</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">2. How We Use Your Information</h3>
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
                  <h3 className="text-xl font-semibold mb-3">3. Data Storage and Security</h3>
                  <p className="text-muted-foreground">
                    We use industry-standard security measures to protect your data. Our services are hosted on secure servers, and we regularly update our security practices to ensure your information remains protected.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">4. Third-Party Services</h3>
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
                  <h3 className="text-xl font-semibold mb-3">5. Your Rights</h3>
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
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Contact Information</h2>
              <p className="text-muted-foreground">
                For any questions regarding these terms or privacy policy, please contact us at support@learnmorals.com
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

export default Terms;