'use client';

import './page.css'
import Parallax from "@/components/listeners/Parallax";
import FaqAccordion from "@/components/listeners/FaqAccordion";
import HeaderHide from "@/components/listeners/HeaderHide";
import PortfolioDragSlider from "@/components/listeners/PortfolioDragSlider";
import ContactForm from "@/components/ContactForm";
import BurgerMenu from "@/components/listeners/BurgerMenu";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import LoginModal from "@/components/LoginModal";
import ProfileModal from "@/components/ProfileModal";
import ImageModal from "@/components/ImageModal";
import MasterRedirect from "@/components/MasterRedirect";
import LoginQueryHandler from "@/components/LoginQueryHandler";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBookingModal } from "@/contexts/BookingModalContext";
import { translations } from "@/lib/translations";
import { useState } from "react";

export default function Home() {
  const { language } = useLanguage();
  const { openModal: openBookingModal } = useBookingModal();
  const t = translations[language];
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);
  
  return (
    <>
		<MasterRedirect />
		<LoginQueryHandler />
		<Parallax />
		<FaqAccordion />
		<PortfolioDragSlider />
		<img src="/assets/icons/f-e-1.svg" alt="" className="f-e-1"/>
		<img src="/assets/icons/f-e-1-mob.svg" alt="" className="f-e-1-mob"/>
		<Header />

		<section id="hero" className="hero">
			<div className="hero__container container">
				<div className="hero__left">
				<div className="hero__left-title">{t.heroTitle}</div>
				<div className="hero__left-subtitle">{t.heroSubtitle}</div>
				<button onClick={openBookingModal} className="hero__left-link">{t.bookOnline}</button>
				</div>
				<div className="hero__right">
					<img src="/assets/icons/golova.svg" alt="Hair Lab" className="hero__right-image" />
				</div>
			</div>
		</section>

		<section id="about" className="about">
			<div className="about__container container">
				<div className="about__top">
					<div className="about__top-left">
						<div className="about__top-title">
							<span>HAIR</span>
							<span>LAB</span>
						</div>
						<div className="about__top-subtitle">{t.aboutSubtitle1}</div>
						<div className="about__top-subtitle">{t.aboutSubtitle2}</div>
					</div>
					<div className="about__top-right">
						<img className="parallax-element" src="assets/icons/mashinka.svg" alt=""/>
					</div>
				</div>
				<div className="about__bottom">
					<div className="about__bottom-card">
						<div className="about__bottom-card-subtitle">{t.aboutCard1}</div>
						<div className="about__bottom-card-title">{t.aboutCard1Value}</div>
					</div>
					<div className="about__bottom-card">
						<div className="about__bottom-card-subtitle">{t.aboutCard2}</div>
						<div className="about__bottom-card-title">{t.aboutCard2Value}</div>
					</div>
					<div className="about__bottom-card">
						<div className="about__bottom-card-subtitle">{t.aboutCard3}</div>
						<div className="about__bottom-card-title">{t.aboutCard3Value}</div>
					</div>
				</div>
			</div>
		</section>

		<section className="doing" id="doing">
			<div className="doing__container container">
				<div className="doing__top">
					<div className="doing__title block__title">{t.servicesTitle}</div>
					<div className="doing__subtitle block__subtitle">{t.servicesSubtitle}</div>
				</div>
				<div className="doing__bottom">
					<div className="doing__bottom-card glass-border">
						<div className="doing__bottom-card-title">{t.service1Title}</div>
						<div className="doing__bottom-card-image"><img src="assets/icons/ukhod.svg" alt=""/></div>
						<div className="line"></div>
						<div className="doing__bottom-card-subtitle">{t.service1Desc}</div>
					</div>
					<div className="doing__bottom-card glass-border">
						<div className="doing__bottom-card-title">{t.service2Title}</div>
						<div className="doing__bottom-card-image"><img src="assets/icons/pricheska.svg" alt=""/></div>
						<div className="line"></div>
						<div className="doing__bottom-card-subtitle">{t.service2Desc}</div>
					</div>
					<div className="doing__bottom-card glass-border">
						<div className="doing__bottom-card-title">{t.service3Title}</div>
						<div className="doing__bottom-card-image"><img src="assets/icons/okras.svg" alt=""/></div>
						<div className="line"></div>
						<div className="doing__bottom-card-subtitle">{t.service3Desc}</div>
					</div>
					<div className="doing__bottom-card glass-border">
						<div className="doing__bottom-card-title">{t.service4Title}</div>
						<div className="doing__bottom-card-image"><img src="assets/icons/stil.svg" alt=""/></div>
						<div className="line"></div>
						<div className="doing__bottom-card-subtitle">{t.service4Desc}</div>
					</div>
				</div>
			</div>
			<img className="f-e-2" src="assets/icons/f-e-2.svg" loading="lazy" decoding="async"/>
		</section>

		<section id="portfolio" className="portfolio">
			<div className="portfolio__container container">
				<div className="portfolio__title block__title">{t.portfolioTitle}</div>
				<div className="portfolio__cards">
					<div className="portfolio__card glass-border">
						<div className="portfolio__card-img"><img src="assets/images/prich1.png" alt="" loading="lazy"
								decoding="async"/></div>
						<div className="portfolio__card-title">{t.portfolioCard1Name}</div>
						<div className="portfolio__card-subtitle">{t.portfolioCard1Subtitle}</div>
						<div className="portfolio__card-list">
							<div className="portfolio__card-list-element">
								<img className="portfolio__card-list-element-icon" src="assets/icons/check.svg" alt=""/>
								<div className="portfolio__card-list-element-text">{t.portfolioCard1Item1}</div>
							</div>
							<div className="portfolio__card-list-element">
								<img className="portfolio__card-list-element-icon" src="assets/icons/check.svg" alt=""/>
								<div className="portfolio__card-list-element-text">{t.portfolioCard1Item2}</div>
							</div>
						</div>
						<button 
							className="portfolio__card-btn hero__left-link" 
							onClick={() => setSelectedImage({ url: 'assets/images/prich1.png', alt: t.portfolioCard1Name })}
						>
							{t.portfolioViewResult}
						</button>
					</div>
					<div className="portfolio__card glass-border">
						<div className="portfolio__card-img"><img src="assets/images/prich2.png" alt="" loading="lazy"
								decoding="async"/></div>
						<div className="portfolio__card-title">{t.portfolioCard2Name}</div>
						<div className="portfolio__card-subtitle">{t.portfolioCard2Subtitle}</div>
						<div className="portfolio__card-list">
							<div className="portfolio__card-list-element">
								<img className="portfolio__card-list-element-icon" src="assets/icons/check.svg" alt=""/>
								<div className="portfolio__card-list-element-text">{t.portfolioCard2Item1}</div>
							</div>
							<div className="portfolio__card-list-element">
								<img className="portfolio__card-list-element-icon" src="assets/icons/check.svg" alt=""/>
								<div className="portfolio__card-list-element-text">{t.portfolioCard2Item2}</div>
							</div>
						</div>
						<button 
							className="portfolio__card-btn hero__left-link" 
							onClick={() => setSelectedImage({ url: 'assets/images/prich2.png', alt: t.portfolioCard2Name })}
						>
							{t.portfolioViewResult}
						</button>
					</div>
					<div className="portfolio__card glass-border">
						<div className="portfolio__card-img"><img src="assets/images/prich3.png" alt="" loading="lazy"
								decoding="async"/></div>
						<div className="portfolio__card-title">{t.portfolioCard3Name}</div>
						<div className="portfolio__card-subtitle">{t.portfolioCard3Subtitle}</div>
						<div className="portfolio__card-list">
							<div className="portfolio__card-list-element">
								<img className="portfolio__card-list-element-icon" src="assets/icons/check.svg" alt=""/>
								<div className="portfolio__card-list-element-text">{t.portfolioCard3Item1}</div>
							</div>
							<div className="portfolio__card-list-element">
								<img className="portfolio__card-list-element-icon" src="assets/icons/check.svg" alt=""/>
								<div className="portfolio__card-list-element-text">{t.portfolioCard3Item2}</div>
							</div>
						</div>
						<button 
							className="portfolio__card-btn hero__left-link" 
							onClick={() => setSelectedImage({ url: 'assets/images/prich3.png', alt: t.portfolioCard3Name })}
						>
							{t.portfolioViewResult}
						</button>
					</div>
				</div>
			</div>
		</section>

		<section id="work-process" className="work-process">
			<img className="f-e-3" src="assets/icons/f-e-3.svg" loading="lazy" decoding="async"/>
			<img className="f-e-3-tab" src="assets/icons/f-e-3-tab.svg" loading="lazy" decoding="async"/>

			<div className="fon__element-3 "><img src="assets/icons/fon__element-2.svg" alt=""/></div>
			<div className="fon__element-3 "><img src="assets/icons/fon__element-1.svg" alt=""/></div>
			<div className="work-process__container container">
				<div className="work-process__title block__title">{t.workProcessTitle}</div>
				<div className="work-process__body">
					<div className="work-process__left">
						{t.workProcessLeft}
					</div>
					<div className="work-process__right">
						<div className="work-process__right-text" dangerouslySetInnerHTML={{
							__html: t.workProcessRight
						}}></div>
						<div className="work-process__right-cards">
							<div className="work-process__right-card glass-border">
								<div className="work-process__right-card-title">01</div>
								<div className="work-process__right-card-subtitle">{t.workProcessCard1Title}</div>
								<div className="work-process__right-card-subtitle-2">{t.workProcessCard1Desc}</div>
							</div>
							<div className="work-process__right-card glass-border">
								<div className="work-process__right-card-title">02</div>
								<div className="work-process__right-card-subtitle">{t.workProcessCard2Title}</div>
								<div className="work-process__right-card-subtitle-2">{t.workProcessCard2Desc}</div>
							</div>
							<div className="work-process__right-card glass-border">
								<div className="work-process__right-card-title">03</div>
								<div className="work-process__right-card-subtitle">{t.workProcessCard3Title}</div>
								<div className="work-process__right-card-subtitle-2">{t.workProcessCard3Desc}</div>
							</div>
							<div className="work-process__right-card glass-border">
								<div className="work-process__right-card-title">04</div>
								<div className="work-process__right-card-subtitle">{t.workProcessCard4Title}</div>
								<div className="work-process__right-card-subtitle-2">{t.workProcessCard4Desc}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section id="team" className="team">
			<div className="team__container container">
				<div className="team__title block__title">{t.teamTitle}</div>
				<div className="team__subtitle block__subtitle"><span>HAIR LAB</span> {t.teamSubtitle}</div>
				<div className="team__cards">
					<div className="team__card glass-border">
						<div className="team__card-img"><img src="assets/images/jon.png" alt=""/></div>
						<div className="line"></div>
						<div className="team__card-title">{t.teamMember1Name}</div>
						<div className="team__card-subtitle">{t.teamMember1Role}</div>
					</div>
					<div className="team__card glass-border">
						<div className="team__card-img"><img src="assets/images/ned.png" alt=""/></div>
						<div className="line"></div>
						<div className="team__card-title">{t.teamMember2Name}</div>
						<div className="team__card-subtitle">{t.teamMember2Role}</div>
					</div>
					<div className="team__card glass-border">
						<div className="team__card-img"><img src="assets/images/rob.png" alt=""/></div>
						<div className="line"></div>
						<div className="team__card-title">{t.teamMember3Name}</div>
						<div className="team__card-subtitle">{t.teamMember3Role}</div>
					</div>
					<div className="team__card glass-border">
						<div className="team__card-img"><img src="assets/images/jayme.png" alt=""/></div>
						<div className="line"></div>
						<div className="team__card-title">{t.teamMember4Name}</div>
						<div className="team__card-subtitle">{t.teamMember4Role}</div>
					</div>
				</div>
			</div>
		</section>

		<section id="why-dc" className="why-dc">
			<div className="why-dc__contaiener container">
				<div className="why-dc__title block__title">
					{t.whyTitle}
				</div>


				<div className="why-dc__bg-text two">HAIR<br/>LAB</div>
				<div className="why-dc__bg-text one">BARBER<br/>SHOP</div>
				<div className="why-dc__grid">
					<div className="why-dc__grid-elem glass-border">
						<div className="why-dc__grid-elem-title">01</div>
						<div className="why-dc__grid-elem-subtitle">{t.whyItem1}</div>
					</div>
					<div className="why-dc__grid-elem glass-border">
						<div className="why-dc__grid-elem-title">02</div>
						<div className="why-dc__grid-elem-subtitle">{t.whyItem2}</div>
					</div>
					<div className="why-dc__grid-elem glass-border">
						<div className="why-dc__grid-elem-title">03</div>
						<div className="why-dc__grid-elem-subtitle">{t.whyItem3}</div>
					</div>
					<div className="why-dc__grid-elem glass-border">
						<div className="why-dc__grid-elem-title">04</div>
						<div className="why-dc__grid-elem-subtitle">{t.whyItem4}</div>
					</div>
					<div className="why-dc__grid-elem glass-border">
						<div className="why-dc__grid-elem-title">05</div>
						<div className="why-dc__grid-elem-subtitle">{t.whyItem5}</div>
					</div>
					<div className="why-dc__grid-elem glass-border">
						<div className="why-dc__grid-elem-title">06</div>
						<div className="why-dc__grid-elem-subtitle">{t.whyItem6}</div>
					</div>
				</div>
			</div>
		</section>

		<section id="faq" className="faq">
			<img className="f-e-faq-mob" src="assets/icons/f-e-faq-mob.svg" loading="lazy" decoding="async"/>

			<div className="faq__container container">
				<div className="faq__title block__title">{t.faqTitle}</div>
				<div className="faq__questions">
					<div className="faq__questions-element">
						<div>
							<div className="faq__questions-element-title">{t.faqQ1}</div>
							<div className="faq__questions-element-subtitle">{t.faqA1}</div>
						</div>
						<div className="plus">
							<div></div>
							<div></div>
						</div>
					</div>
					<div className="faq__questions-element">
						<div>
							<div className="faq__questions-element-title">{t.faqQ2}</div>
							<div className="faq__questions-element-subtitle">{t.faqA2}</div>
						</div>
						<div className="plus">
							<div></div>
							<div></div>
						</div>
					</div>
					<div className="faq__questions-element">
						<div>
							<div className="faq__questions-element-title">{t.faqQ3}</div>
							<div className="faq__questions-element-subtitle">{t.faqA3}</div>
						</div>
						<div className="plus">
							<div></div>
							<div></div>
						</div>
					</div>
					<div className="faq__questions-element">
						<div>
							<div className="faq__questions-element-title">{t.faqQ4}</div>
							<div className="faq__questions-element-subtitle">{t.faqA4}</div>
						</div>
						<div className="plus">
							<div></div>
							<div></div>
						</div>
					</div>
					<div className="faq__questions-element">
						<div>
							<div className="faq__questions-element-title">{t.faqQ5}</div>
							<div className="faq__questions-element-subtitle">{t.faqA5}</div>
						</div>
						<div className="plus">
							<div></div>
							<div></div>
						</div>
					</div>
					<div className="faq__questions-element">
						<div>
							<div className="faq__questions-element-title">{t.faqQ6}</div>
							<div className="faq__questions-element-subtitle">{t.faqA6}</div>
						</div>
						<div className="plus">
							<div></div>
							<div></div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section id="contacts" className="contacts">
			<div className="contacts__container container">
				<div className="contacts__left">
					<div className="contacts__title">{t.contactsQuestion}</div>
					<div className="contacts__subtitle">{t.contactsSubtitle}</div>
					<ContactForm />
					<div className="contacts__info">{t.contactsAgreement} <a href=""> {t.contactsAgreementLink}</a></div>
        </div>
				<div className="contacts__right">
					<div className="contacts__title">{t.contactsTitle}</div>
					<div className="contacts__right-contacts">
						<div>
							<img src="assets/icons/tel-icon.svg" alt="" />
							<a href="tel:+78888888888">8 (888) 888 88 88</a>
						</div>
						<div>
							<img src="assets/icons/gmail-icon.svg" alt="" />
							<a href="mailto:">hairlab@hairlab.ru</a>
						</div>
						<div>
							<img src="assets/icons/tg-icon.svg" alt="" />
							<a href="https://t.me/durov">@Hairlabtg</a>
						</div>
					</div>
				</div>
			</div>
		</section>

		<Footer />

		<img className="f-b one" src="assets/icons/f-b-l.svg" alt=""/>
		<img className="f-b two" src="assets/icons/f-b-r.svg" alt=""/>
		
		<BookingModal />
		<LoginModal />
		<ProfileModal />
		
		{selectedImage && (
			<ImageModal
				isOpen={!!selectedImage}
				imageUrl={selectedImage.url}
				alt={selectedImage.alt}
				onClose={() => setSelectedImage(null)}
			/>
		)}
    </>
  )
}
