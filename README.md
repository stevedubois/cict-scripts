# CICT Scriptkit

<p>"Deze scripts bieden een verzameling van tools en experimenten waarmee je AI binnen handbereik hebt op je pc."</p>

## Hoe te installeren

- Installeer [GitHub](https://git-scm.com/downloads) voor je besturingssysteem. Kies alle standaard instellingen (steeds op volgende klikken)

- Installeer [ScriptKit](https://www.scriptkit.com/) voor je besturingssysteem.

- Als je een melding krijgt van Microsoft Smartscreen waarin wordt voorkomen dat een onbekende app wordt gestart, volg dan de volgende stappen: klik met de rechtermuisknop op het .exe-bestand; selecteer "Eigenschappen"; zet een vinkje bij "Blokkeren opheffen"; klik op "Toepassen"; nu kan je de software zonder problemen installeren.

- Open de Kit-app:
    - Als het al opgestart is, vind je het als een geel symbooltje in het systeemvak (rechterbenedenhoek van de taakbalk in Windows)
    - Rechtermuisklik erop en klik op "open Kit.app Prompt"
    - Indien het nog niet opgestart is, start het dan op via Start - zoek naar "Kit" en klik op de Kit-app. 

- Open het kit-tabblad, scroll naar "Manage Kenvs" of beginnen met typen van "kenv" om deze optie te zien. Dit zijn afzonderlijke omgevingen om scripts gescheiden te houden.

![https://i.ibb.co/tcSf3fd/a.png](https://i.ibb.co/tcSf3fd/a.png)

- Ga naar "Clone repo of scripts" en druk op enter.

- Geef volgende repository op en druk op enter: https://github.com/stevedubois/cict-scripts

- De naam en directory mag zijn: cict-scripts (geef dit op als er naar gevraagd wordt).

- Indien er om bevestiging gevraagd wordt of je het veilig is ("ja, dat is het"), type dan nogmaal cict-scripts

- De eerste keer moet je de promps nog importeren en afhankelijkheden installeren. 
    - Het eerste doe je door ctrl+shift+O om de prompt-organisator te openen. Je mag dit verder sluiten.
    - Het tweede doe je door ctrl+shift+P. Er zal dan gevraagd worden afhankelijkheden te installeren en de api-key (persoonlijk of van je organisatie) op te geven. 

## Hoe te gebruiken

- Selecteer ergens een tekst, sta met je cursor op de tekst en klik ctrl+shift+p om de prompt te kiezen dat je wil laten lopen op die geselecteerde tekst.

- Je kan beginnen typen om de opties die je kan selecteren te beperken

- Je kan ook een gehele eigen prompt typen om uit te voeren op de geseleteerde tekst.

- Het gemakkelijkste is om één van de voorgeprogrammeerde prompts te gebruiken.
    - "T - Tekst Nederlands (herschrijf/verbeter/vertaal)" : zet rommelige tekst om in een vloeibare tekst, vebetert fouten, verandert zinsconstructies, enz... Kan ook vertalen van een andere taal naar het Nederlands.
    - "TS - Tekst Corrigeer spelling/grammatica - Nederlands : corrigeert tekst die al redelijk goed geschreven is op spelling en gramatica, laat de inhoud ongemoeid.
    - "L Leg uit" : selecteer tekst op een website bvb. en laat de inhoud uitleggen door ChatGPT: Eenvoudige uileg (uitleggen aan een 5-jarige) en uitgebreide uitleg.
    - ...

- Optioneel kan je dan nog (of druk nog eens op "enter" op dit over te slaan):
    - de temperatuur instellen: van 0.0 (strikt) tot 1.0 (creatief)
    - uitgebreidere respons of juist kortere vragen
    - gebruik laten maken van GPT-4 in plaats van de standaard Chat-GPT-3.5-turbo (werkt enkel als de api-key goedgekeurd is voor GPT-4 toegang)

- Je krijgt dan je respons van ChatGPT en daar kan je nog het volgende mee doen:
    -Reply: in conversatie gaan met de respons, je kan hierbij bijvragen stellen of vragen het toch nog anders te formuleren, strenger of optimistischer, ...
    -Retry: opnieuw laten genereren als de respons je niet bevalt.
    -Edit: de respons aanpassen voor je op "submit" klikt, bij "submit" zet het je aangepaste tekst in het klembord.
    -Copy: de respons kopiëren naar het klembord, zodat je het zelf ergens kan gaan plakken. Op dit moment is het niet mogelijk enkel een deel van de response te kopiëren, wel als je Edit doet en de rest weghaalt en dan "submit" klikt.
    -Paste: de response direct plakken, de tekst die je geselecteerd had vervangen door de respons.
    -Save: de respons opslaan in een bestand.
    -Continue: sluit gewoon het sript-kit scherm.
    
## Updaten van scripts

- Open de Kit-app:
    - Geel symbooltje in het systeemvak (rechterbenedenhoek van de taakbalk in Windows)
    - Rechtermuisklik erop en klik op "open Kit.app Prompt"
    
- Open het kit-tabblad, scroll naar "Manage Kenvs" of beginnen met typen van "kenv" om deze optie te zien. 

- Vervolgens selecteer je de optie 'Pull Kenv'. Kies de Kenv die je wilt bijwerken, in dit geval 'cict-scripts'.

- Klik op "Merge"

- Als dit laatste een foutmelding geeft, moet je eerst op "Stash" klikken en dan nog eens op "Merge".

- Open dan de prompt-manager ctrl+shift+O om eventueel geüpdatet prompts te importeren: Settings - Import

- Klaar!

## Thanks

This is a adjustment of the following project:
[artificialcitizens/ac-scripts](https://github.com/artificialcitizens/ac-scripts)

Thanks for making this public and possible to modify.