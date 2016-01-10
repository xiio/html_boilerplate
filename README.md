0. Wymagania
===========================
* PHP >= 5.4
* Node.js with npm
* Bower
* Grunt

Downloads cheatsheet:
	
* PHP: [http://php.net/downloads.php](http://php.net/downloads.php)
* Node.js: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
* Bower: `npm install bower -g`
* Grunt: `npm install grunt -g`
	
1. Konfiguracja
===========================
W pierwszej kolejności ustaw ścieżkę do interpretera php w pliku ./config/grunt.yaml

* ./config/grunt.yaml - konfiguracja grunt

2. Inicjalizacja projektu
===========================
Otwórz terminal w katalogu głównym projektu i wykonaj polecenie

`npm install & grunt init`

1. Web
-------------------------
Aby przystąpić do pracy należy uruchomić w terminalu komendę `grunt up`

1. polecenie uruchomi nasłuchawnie zmian w plikach oraz ich kompilację (grunt watch)
2. następnie uruchomiony zostanie serwer php
3. uruchomiona zostanie domyślna przeglądarka z adresem loklalnym projektu

W katalogu `./web` znajdują się dwa podkatalogi

* src - katalog zawierający źródła treści dla przeglądarki. Tutaj pracujemy.
* dist - zawierający build aplikacji. Zawartość pojawia się automatycznie po `grunt build`
	
### Dodawanie bibliotek zewnętrznych
`bower install xxx --save`
zainstalowana biblioteka pojawi się w katalogu `./web/src/vendor/`

### Dodawanie plików LESS/Sass
Aby dodać plik `less/scss` nalezy umieścić go w katalogu `./web/src/less`|`./web/src/sass`. Plik powinnien kompilować się automatycznie do katalogu `./web/src/css`

### Dodawanie plików JS/TS
TS - TypeScript(kompilowane automatycznie do katalogu `./web/src/js`
