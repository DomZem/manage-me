## Lab1

### Aplikacja ManagMe - starter

Budujemy aplikację do zarządzania projektami.

- [x] Zrealizuj funkcjonalność CRUD dotyczącą projektu.
- [x] Dane zapisz w localStorage - napisz dedykowaną klasę do komunikacji z api (tymczasowym api będzie localStorage)

Model projektu: id, nazwa, opis

## Lab2

### Użytkownik

- [x] zamodeluj klasę zarządzającą zalogowanym użytkownikiem. Na ten moment chcemy mock zalogowanego użytkownika (bez opcji logowania, zakładania konta etc)
- [x] wyświetl imię/nazwisko zalogowanego użytkownika

### Aktywny projekt

- [x] Zrealizuj w aplikacji wybór "aktualnego" projektu. Czyli wybieram projekt, apka go zapamiętuje (api) i do czasu zmiany wszystko co widzę w aplikacji jest związane jedynie z tym projektem.

### Historyjki (funkcjonalności) projektu

- [x] Zrealizuj CRUD do historyjki (funkcjonalności) w projekcie
- [x] Historyjki powinny się zapisywać za pośrednictwem zaprojektowanej poprzednio klasy do komunikacji z api
- [x] Widok listy historyjek powininen dzielić historyjki na aktualnie wykonywane, czekające na wykonanie i zamknięte (lub jedna lista z filtrowaniem)

Model użytkownika: id, imię, nazwisko  
Model historyjki: id, nazwa, opis, priorytet (niski/średni/wysoki), projekt, data utworzenia, stan (todo/doing/done), właściciel (id użytkownika)

## Lab3

### Użytkownicy

- [x] Rozbuduj model użytkownika o rolę. Możliwe role: admin, devops, developer.
- [x] Zamockuj listę użytkowników. Zalogowany pozostaje admin, na liście powinien być jeszcze minimum jeden developer i jeden devops

### Zadania

Zadanie to najmniejsza jednostka projektu. Jest wykonywana przez jedną osobę, jest przypisane do konkretnej historyjki, jest możliwe do zamknięcia.

- [x] Zrealizuj CRUD do zadania.
- [x] Zrealizuj widok szczegółów zadania - dane zadania, przypisana historyjka, data startu, zrealizowane roboczogodziny, przypisana osoba
- [x] Widok szczegółów zadania (lub dodatkowy widok) powinien dostarczać możliwość przypisania osoby do zadania (devops lub developer). Przypisanie osoby automatycznie zmienia stan zadania z "todo" na "doing" oraz uzupełnia datę startu zadania.
- [x] Widok szczegółów zadania (lub dodatkowy widok) powinien dostarczać możliwość zmiany stanu zadania na "done". Zmiana stanu automatycznie uzupełnia datę zakończenia zadania.
- [x] Zrealizuj widok tablicy kanban z zadaniami (kolumny todo, doing, done)
- [x] Zadania powinny się zapisywać za pośrednictwem mechanizmu komunikacji z api

Model Zadania:

- Nazwa
- Opis
- Priorytet (niski/średni/wysoki)
- Historyjka do której przynależy zadanie
- Przewidywany czas wykonania
- Stan (todo, doing, done). Zadanie ze stanem doing musi posiadać czas startu oraz przypisanego użytkownika. Zadanie ze stanem done posiada przypisanego użytkownika oraz datę zakończenia
- Data dodania
- Data startu (stan zmieniony na doing)
- Data zakończenia (stan zmieniony na done)
- Użytkownik odpowiedzialny za zadanie (zadanie może wykonywać devops lub developer)

## Lab4

### Logowanie

- [x] Utwórz formularz logowania (pola: login, hasło)
- [x] Dane powinny zostać wysłane do API (zaprojektuj endpoint)

### API

- [x] zaprojektuj endpoint do logowania - pobiera login i hasło, weryfikuje i zwraca token (JWT) i refreshToken lub błąd
- [x] zaprojektuj endpoint do odświeżania tokenu JWT
- [] zaprojektuj endpoint do pobrania danych aktualnie zalogowanego użytkownika (pełny model użytkownika bez hasła)

### Technologie

Wykorzystaj dowolną technologię do utworzenia API - co lubisz. Jeśli nie masz pomysłu - przykładowy starter API znajdziesz w /miniapi (oparty o Node i bibliotekę Express)

## Lab5

### Wygląd aplikacji

- Skorzystaj z dowolnej biblioteki CSS/komponentów (przykładowe biblioteki poniżej) do dopracowania UI aplikacji
- Poćwicz użycie ai w vscode - wykorzystaj copilota w trybie edit/agenta do implementacji wybranej biblioteki do istniejącego projektu/html-a
- Zaimplementuj tryb ciemny/jasny (przełącznik na stronie lub zależny od ustawień przeglądarki)
- Jeśli chcesz możesz zaimplementować prototyp własnej biblioteki styli/komponentów.

#### Przykładowe biblioteki CSS/komponentów:

- [Bootstrap](https://getbootstrap.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Material UI](https://mui.com)
- [Material Web](https://m3.material.io/develop/web)
- [PrimeNg](https://primeng.org/)
- [Ant Design](https://ant.design/)
- [Angular Material](https://material.angular.io/)
- [ChakraUI](https://v2.chakra-ui.com/)
- [KitWind](https://kitwind.io/products/)
- [TailBlocks](https://tailblocks.cc/)
- [Tailwindcomponents](https://tailwindcomponents.com/)

## Lab 6

### Baza danych

- Zmień miejsce magazynowania danych w aplikacji z localStorage na bazę danych. Wykorzystaj bazę NoSQL (np. MongoDB, Google Firestore, Supabase).
- Komunikację z bazą danych może się odbywać zarówno bezpośrednio z aplikacji webowej jak i z pośrednictwem serwera backendowego (do wyboru)
