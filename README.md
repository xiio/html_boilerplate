1. Konfiguracja
===========================
Pliki:
	* ./config/grunt.yaml - konfiguracja grunt
	
W pierwszej kolejności ustaw ścieżkę do interpretera php w pliku ./config/grunt.yaml

2. Inicjalizacja projektu
===========================
Otwórz terminal w katalogu głównym projektu i wykonaj polecenie

`npm install & grunt init`

1. Web
-------------------------
Aby przystąpić do pracy należy uruchomić w terminalu komendę

`grunt up`

	* polecenie uruchomi nasłuchawnie zmian w plikach oraz ich kompilację (grunt watch)
	* następnie uruchomiony zostanie serwer php
	* uruchomiona zostanie domyślna przeglądarka z adresem loklalnym projektu

W katalogu `./web` znajdują się dwa podkatalogi
	* dist - zawierający build aplikacji. Zawartość pojawia się automatycznie po `grunt build`
	* src - katalog zawierający źródła treści dla przeglądarki. Tutaj pracujemy.
	
### Dodawanie bibliotek zewnętrznych
`bower install xxx --save`
zainstalowana biblioteka pojawi się w katalogu `./web/src/vendor/`

### Dodawanie plików LESS/Sass
Aby dodać plik `less/scss` nalezy umieścić go w katalogu `./web/src/less`|`./web/src/sass`. Plik powinnien kompilować się automatycznie do katalogu `./web/src/css`

### Dodawanie plików JS/TS
TS - TypeScript(kompilowane automatycznie do katalogu `./web/src/js`
