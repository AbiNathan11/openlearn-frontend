import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react"

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Social Media Icons */}
                <div className="flex justify-center gap-4 mb-6">
                    <a
                        href="#"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 text-text-secondary hover:text-primary hover:border-primary transition"
                        aria-label="Facebook"
                    >
                        <Facebook size={20} />
                    </a>
                    <a
                        href="#"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 text-text-secondary hover:text-primary hover:border-primary transition"
                        aria-label="Twitter"
                    >
                        <Twitter size={20} />
                    </a>
                    <a
                        href="#"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 text-text-secondary hover:text-primary hover:border-primary transition"
                        aria-label="LinkedIn"
                    >
                        <Linkedin size={20} />
                    </a>
                    <a
                        href="#"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 text-text-secondary hover:text-primary hover:border-primary transition"
                        aria-label="YouTube"
                    >
                        <Youtube size={20} />
                    </a>
                </div>

                {/* Copyright */}
                <p className="text-center text-sm text-text-secondary">
                    © 2024 OpenLearn. All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer
