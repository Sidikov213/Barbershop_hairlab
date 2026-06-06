'use client';

import { useRouter } from 'next/navigation';
import BurgerMenu from "./listeners/BurgerMenu"
import HeaderHide from "./listeners/HeaderHide"
import { useLanguage } from "@/contexts/LanguageContext";
import { useBookingModal } from "@/contexts/BookingModalContext";
import { useLoginModal } from "@/contexts/LoginModalContext";
import { useProfileModal } from "@/contexts/ProfileModalContext";
import { useTheme } from "@/contexts/ThemeContext";
import { translations } from "@/lib/translations";

const Header = () => {
    const router = useRouter();
    const { language, toggleLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const { openModal: openBookingModal } = useBookingModal();
    const { openModal: openLoginModal } = useLoginModal();
    const { openModal: openProfileModal } = useProfileModal();
    const t = translations[language];

    const handleLoginClick = async () => {
        const token = localStorage.getItem('hairlab_token');
        if (!token) {
            openLoginModal();
            return;
        }

        const savedRole = localStorage.getItem('hairlab_role');
        if (savedRole === 'master') {
            router.push('/master');
            return;
        }

        try {
            const { hairLabGetMe } = await import('@/lib/api');
            const user = await hairLabGetMe(token);
            if (user.role === 'master') {
                localStorage.setItem('hairlab_role', 'master');
                router.push('/master');
                return;
            }
        } catch {
            localStorage.removeItem('hairlab_token');
            localStorage.removeItem('hairlab_phone');
            localStorage.removeItem('hairlab_role');
            openLoginModal();
            return;
        }

        openProfileModal();
    };

    return (
        <>
            <HeaderHide />
            <BurgerMenu />
            <header>
                <div className="herder__container container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div className="logo">HAIRLAB</div>
                        <button 
                            className="header__theme-toggle" 
                            onClick={toggleTheme}
                            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                            title={theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
                        >
                            {theme === 'dark' ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 3V4M12 20V21M4 12H3M5.636 5.636L4.929 4.929M18.364 18.364L19.071 19.071M21 12H20M18.364 5.636L19.071 4.929M5.636 18.364L4.929 19.071M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="menu">
                        <nav>
                            <a className="header__menu-link active" href="#hero">{t.home}</a>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#about">{t.about}</a>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#doing">{t.services}</a>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#portfolio">{t.portfolio}</a>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#team">{t.team}</a>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#faq">{t.faq}</a>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#contacts">{t.contacts}</a>
                        </nav>
                    </div>
                    <div className="call">
                        <button 
                            onClick={handleLoginClick} 
                            className="header__login-btn" 
                            aria-label="Login"
                        >
                            <img src="/assets/icons/login.svg" alt="Login" />
                        </button>
                        <button onClick={openBookingModal} className="call-btn">{t.bookOnline}</button>
                        <button 
                            className="header__lang-btn" 
                            onClick={toggleLanguage}
                            aria-label="Switch language"
                        >
                            {language.toUpperCase()}
                        </button>
                        <div className="header__burger">
                            <div className="header__burger-line"></div>
                            <div className="header__burger-line"></div>
                            <div className="header__burger-line"></div>
                        </div>
                    </div>
                </div>

                <div className="burger__menu glass-border">
                    <div className="burger__menu-links">
                        <nav>
                            <a className="header__menu-link active" href="#hero">{t.home}</a>
                            <img src="assets/icons/link.svg" alt=""/>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#about">{t.about}</a>
                            <img src="assets/icons/link.svg" alt=""/>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#doing">{t.services}</a>
                            <img src="assets/icons/link.svg" alt=""/>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#portfolio">{t.portfolio}</a>
                            <img src="assets/icons/link.svg" alt=""/>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#team">{t.team}</a>
                            <img src="assets/icons/link.svg" alt=""/>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#faq">{t.faq}</a>
                            <img src="assets/icons/link.svg" alt=""/>
                        </nav>
                        <nav>
                            <a className="header__menu-link " href="#contacts">{t.contacts}</a>
                            <img src="assets/icons/link.svg" alt=""/>
                        </nav>
                    </div>
                    <div className="burger__menu-social">
                        <a href="">8 (800) 101 43 25</a>
                        <div className="footer__top-right-cosial">
                            <a href=""><img src="/assets/icons/vk-icon.svg" alt=""/></a>
                            <a href=""><img src="/assets/icons/yt-icon.svg" alt=""/></a>
                            <a href=""><img src="/assets/icons/tg-icon.svg" alt=""/></a>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header