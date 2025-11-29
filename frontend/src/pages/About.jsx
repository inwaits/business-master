export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">About Business Master</h1>
      <div className="space-y-6 text-gray-700">
        <p className="text-lg">
          Business Master is Sri Lanka's premier tutor management platform, connecting qualified tutors with students seeking personalized education.
        </p>
        <p>
          Our mission is to make quality education accessible to everyone through our innovative matching algorithm and comprehensive management system.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Verified and qualified tutors</li>
          <li>Smart matching algorithm</li>
          <li>Secure payment processing</li>
          <li>Session tracking and reporting</li>
          <li>Real-time notifications</li>
          <li>Quality assurance and reviews</li>
        </ul>
      </div>
    </div>
  )
}

