"use client";

import React, { useState } from 'react';
import { ArrowRight, Play, Menu, X } from 'lucide-react';

interface NavLink {
    label: string;
    href: string;
    isActive?: boolean;
}

interface Partner {
    logoUrl: string;
    href: string;
}

interface ResponsiveHeroBannerProps {
    logoUrl?: string;
    backgroundImageUrl?: string;
    navLinks?: NavLink[];
    ctaButtonText?: string;
    ctaButtonHref?: string;
    badgeText?: string;
    badgeLabel?: string;
    title?: string;
    titleLine2?: string;
    description?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    partnersTitle?: string;
    partners?: Partner[];
}

const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
    logoUrl = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=60&fit=crop",
    backgroundImageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop",
    navLinks = [
        { label: "Home", href: "#", isActive: true },
        { label: "Missions", href: "#" },
        { label: "Destinations", href: "#" },
        { label: "Technology", href: "#" },
        { label: "Book Flight", href: "#" }
    ],
    ctaButtonText = "Reserve Seat",
    ctaButtonHref = "#",
    badgeLabel = "New",
    badgeText = "First Commercial Flight to Mars 2026",
    title = "Journey Beyond Earth",
    titleLine2 = "Into the Cosmos",
    description = "Experience the cosmos like never before. Our advanced spacecraft and cutting-edge technology make interplanetary travel accessible, safe, and unforgettable.",
    primaryButtonText = "Book Your Journey",
    primaryButtonHref = "#",
    secondaryButtonText = "Watch Launch",
    secondaryButtonHref = "#",
    partnersTitle = "Partnering with leading space agencies worldwide",
    partners = [
        { logoUrl: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=120&h=40&fit=crop", href: "#" },
        { logoUrl: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=120&h=40&fit=crop", href: "#" },
        { logoUrl: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=120&h=40&fit=crop", href: "#" },
        { logoUrl: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=120&h=40&fit=crop", href: "#" },
        { logoUrl: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=120&h=40&fit=crop", href: "#" }
    ]
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#09090b]">
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        {/* Logo */}
                        <a href="#" className="flex-shrink-0">
                            <img 
                                src={logoUrl} 
                                alt="Logo" 
                                className="h-10 w-auto"
                            />
                        </a>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex md:items-center md:gap-8">
                            {navLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors ${
                                        link.isActive 
                                            ? 'text-white' 
                                            : 'text-white/70 hover:text-white'
                                    }`}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <a
                                href={ctaButtonHref}
                                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-all hover:bg-white/90"
                            >
                                {ctaButtonText}
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur"
                            aria-expanded={mobileMenuOpen}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5 text-white" />
                            ) : (
                                <Menu className="h-5 w-5 text-white" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10">
                        <div className="px-4 py-4 space-y-3">
                            {navLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className={`block py-2 text-base font-medium ${
                                        link.isActive 
                                            ? 'text-white' 
                                            : 'text-white/70'
                                    }`}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <a
                                href={ctaButtonHref}
                                className="block w-full text-center rounded-full bg-white px-5 py-3 text-sm font-medium text-black mt-4"
                            >
                                {ctaButtonText}
                            </a>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Content */}
            <div className="relative z-10 flex min-h-[calc(100vh-5rem)] flex-col justify-center">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
                    <div className="max-w-3xl animate-fade-slide-in">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/20 backdrop-blur mb-8">
                            <span className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                                {badgeLabel}
                            </span>
                            <span className="text-sm text-white/90">
                                {badgeText}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
                            {title}
                            <br />
                            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                                {titleLine2}
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg sm:text-xl text-white/70 max-w-2xl mb-10">
                            {description}
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href={primaryButtonHref}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-medium text-black transition-all hover:bg-white/90 hover:scale-105"
                            >
                                {primaryButtonText}
                                <ArrowRight className="h-5 w-5" />
                            </a>
                            <a
                                href={secondaryButtonHref}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-8 py-4 text-base font-medium text-white ring-1 ring-white/20 backdrop-blur transition-all hover:bg-white/20"
                            >
                                {secondaryButtonText}
                                <Play className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Partners Section */}
                    <div className="mt-20 pt-10 border-t border-white/10">
                        <p className="text-sm text-white/50 mb-8 text-center sm:text-left">
                            {partnersTitle}
                        </p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8 lg:gap-12">
                            {partners.map((partner, index) => (
                                <a 
                                    key={index} 
                                    href={partner.href}
                                    className="opacity-50 hover:opacity-100 transition-opacity"
                                >
                                    <img 
                                        src={partner.logoUrl} 
                                        alt={`Partner ${index + 1}`}
                                        className="h-8 w-auto grayscale hover:grayscale-0 transition-all"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponsiveHeroBanner;
