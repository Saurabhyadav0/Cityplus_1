export default function PrivacyPolicyPage() {
  return (
    <section className="privacy-policy bg-white text-black px-6 sm:px-10 py-12 max-w-6xl mx-auto leading-7">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 border-b-4 border-gray-800 inline-block pb-2">
        Privacy Policy
      </h1>

      <p className="mb-8 text-gray-700">
        This Privacy Policy describes how <strong>CityFix</strong> (“we”, “our”, or “us”) collects,
        uses, stores, and protects your personal information when you access or use our platform,
        website, or mobile applications. By using CityFix, you acknowledge that you have read,
        understood, and agreed to the terms of this Privacy Policy. If you do not agree, kindly
        refrain from using our services.
      </p>

      {/* SECTION 1 */}
      <div className="shadow-md border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>Personal details such as your name, email address, phone number, and profile photo.</li>
          <li>Location data for community issue reporting (e.g., potholes, waste collection).</li>
          <li>Login credentials or authentication details when you create an account.</li>
          <li>Device information like IP address, browser type, and operating system.</li>
          <li>Interaction history including feedback, comments, or posts you make on CityFix.</li>
          <li>Payment information, if you avail premium features or make donations.</li>
        </ul>
      </div>

      {/* SECTION 2 */}
      <div className="shadow-md border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>Enable you to report civic issues and track resolutions in real-time.</li>
          <li>Send you notifications about community updates or announcements.</li>
          <li>Improve app functionality, security, and user engagement.</li>
          <li>Comply with legal or regulatory obligations.</li>
          <li>Conduct research and analytics to improve our services.</li>
        </ul>
      </div>

      {/* SECTION 3 */}
      <div className="shadow-md border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Data Retention & Security</h2>
        <p className="text-gray-700">
          CityFix stores your personal information only as long as it is necessary for delivering
          our services. We employ strong security measures such as:
        </p>
        <ul className="list-disc ml-6 space-y-2 text-gray-700 mt-2">
          <li>SSL encryption to secure data transmission.</li>
          <li>Strict access controls and authentication systems.</li>
          <li>Encrypted storage of sensitive information like passwords.</li>
          <li>Regular monitoring to prevent unauthorized access or misuse.</li>
        </ul>
      </div>

      {/* SECTION 4 */}
      <div className="shadow-md border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Sharing of Information</h2>
        <p className="text-gray-700">
          We do not sell or rent your personal data. However, we may share it with trusted third
          parties in the following cases:
        </p>
        <ul className="list-disc ml-6 space-y-2 text-gray-700 mt-2">
          <li>With municipal authorities for resolving reported civic issues.</li>
          <li>With third-party service providers (e.g., payment gateways, hosting partners).</li>
          <li>For legal reasons, such as responding to government requests or preventing fraud.</li>
        </ul>
      </div>

      {/* SECTION 5 */}
      <div className="shadow-md border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>Request access to your personal data stored with us.</li>
          <li>Request correction or updates to inaccurate or incomplete data.</li>
          <li>Request deletion of your account and personal information (“Right to be Forgotten”).</li>
          <li>Withdraw consent to certain data collection activities.</li>
          <li>File a complaint with regulatory authorities in case of data misuse.</li>
        </ul>
      </div>

      {/* SECTION 6 */}
      <div className="shadow-md border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Changes to This Policy</h2>
        <p className="text-gray-700">
          CityFix reserves the right to update or modify this Privacy Policy at any time. Significant
          changes will be notified via email or in-app notifications. We encourage you to review this
          page regularly to stay informed.
        </p>
      </div>

      {/* SECTION 7 */}
      <div className="shadow-md border border-gray-200 rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
        <p className="text-gray-700">
          If you have questions, concerns, or complaints about this Privacy Policy, feel free to
          reach out at:
        </p>
        <p className="mt-3 text-gray-700">
          📧{" "}
          <a href="mailto:support@cityfix.com" className="text-blue-600 underline">
            support@cityfix.com
          </a>
          <br />
          📍 CityFix HQ, Palwal, Haryana, India
        </p>
      </div>
    </section>
  )
}
