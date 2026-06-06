'use client';

import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

const Footer = () => {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <footer className="footer">
            <div className="footer__container container">
                <div className="footer__top">
                    <div className="footer__top-left">
                        <div className="logo footer__logo">HAIRLAB</div>
                        <div className="footer__text">{t.footerTagline}</div>
                        <div className="footer__text">
                            <img src="assets/icons/bloated-heart-icon.svg" alt="" />
                            {`2025 ${t.footerCopyright}`}
                        </div>
                    </div>
                    <div className="footer__top-right">
                        <a className="footer__top-right-tel" href="tel:+78888888888">8 (888) 888 88 88</a>
                        <div className="adress">
                            hairlab@hairlab.ru<br />
                            {t.footerSchedule}
                        </div>
                        <div className="footer__top-right-cosial">
                            <a href="https://vk.com" target="_blank" rel="noopener noreferrer">
                                <img src="/assets/icons/vk-icon.svg" alt="VK" />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                                <img src="/assets/icons/yt-icon.svg" alt="YouTube" />
                            </a>
                            <a href="https://t.me/Hairlabtg" target="_blank" rel="noopener noreferrer">
                                <img src="/assets/icons/tg-icon.svg" alt="Telegram" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
