import React from 'react'
import { Instagram, Facebook, Twitter } from 'lucide-react'
import logo from '../assets/icon1.png'
import fondito from "../assets/bannerHoriz.jpg"

export default function Footer() {
  return (
    <footer className="relative bg-cover bg-center text-azulito" style={{ backgroundImage: `url(${fondito})` }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="HappyPaws logo" className="w-8 h-8" />
            <span className="text-azulito font-semibold text-lg">HappyPaws</span>
          </div>
          <div className="text-lg">
            <ul className="flex flex-wrap justify-center gap-4 md:gap-6 text-azulito">
              <li>
                <a href="/aboutus" className="hover:underline whitespace-nowrap">
                  sobre nosotros
                </a>
              </li>
              <li>
                <a href="/contactus" className="hover:underline whitespace-nowrap">
                  contáctanos
                </a>
              </li>
            </ul>
          </div>
          <div className="flex space-x-4 text-azulito">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-azulito">
              <Instagram size={20} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-azulito">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-azulito">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}