import React from 'react';
import HeroSection from '@/components/help/HeroSection';
import QuickLinks from '@/components/help/QuickLinks';
import HelpCategories from '@/components/help/HelpCategories';
import FAQSection from '@/components/help/FAQSection';
import ContactSection from '@/components/help/ContactSection';

export default function Help() {

    return (
        <div className="min-h-screen">
            <HeroSection />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <QuickLinks />
                <HelpCategories filteredCategories={undefined} />
                <FAQSection filteredFaqs={undefined} />
                <ContactSection />
            </div>
        </div>
    );
}