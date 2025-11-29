export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="space-y-4 mb-8">
          <p><strong>Email:</strong> support@businessmaster.com</p>
          <p><strong>Phone:</strong> +94 11 234 5678</p>
          <p><strong>Address:</strong> 123 Galle Road, Colombo 03, Sri Lanka</p>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea rows="4" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

