export default function Contact() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        
        <div className="prose dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p>
              For any questions or concerns about the Uniform Management System, please contact the system administrators:
            </p>
            
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Chris Foreman - District Secretary</h3>
                <p className="text-muted-foreground">cfore5@eq.edu.au</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Jeremie Clarke-Okah - Site Administrator</h3>
                <p className="text-muted-foreground">jclar577@eq.edu.au</p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Office Hours</h3>
                <p className="text-muted-foreground">Monday to Friday: 8:00 AM - 4:00 PM</p>
                <p className="text-muted-foreground">Saturday and Sunday: Closed</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Support</h2>
            <p>
              For technical support or assistance with the system, please include:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Your name and school</li>
              <li>A detailed description of your issue</li>
              <li>Any relevant transaction IDs or references</li>
              <li>The best way to contact you</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}