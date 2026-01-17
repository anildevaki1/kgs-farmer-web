import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { cacheSrc } from './navService';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
	private storage = inject(cacheSrc);

	constructor(private translate: TranslateService) {}

	/** Initialize translation service — use saved language or fallback */
	async init(defaultLang = 'hi') {
		const stored = await this.storage.get('language');
		const lang = stored || defaultLang;
		this.translate.setDefaultLang(defaultLang);
		// ensure translations are loaded before continuing
		try {
			await lastValueFrom(this.translate.use(lang));
		} catch (_) {
			// ignore — language files might already be cached / not available immediately
		}
		// make sure the document gets a matching language class
		this.applyDocumentLangClass(lang);

		// update class on language changes at runtime
		this.translate.onLangChange.subscribe(event => {
			this.applyDocumentLangClass(event.lang);
		});
	}

	set(lang: string) {
		this.translate.use(lang);
		this.storage.set('lang', lang);
		this.applyDocumentLangClass(lang);
	}

	/** Add a language specific class to <html> to allow stylesheet tweaks (font-size etc) */
	private applyDocumentLangClass(lang: string) {
		const root = document.documentElement;
		// remove any previous lang- classes we may have added
		Array.from(root.classList)
			.filter(c => c.startsWith('lang-'))
			.forEach(c => root.classList.remove(c));
		if (lang) root.classList.add(`lang-${lang}`);
	}

	get current() {
		return this.translate.currentLang || this.translate.defaultLang;
	}
}
