## Lab1

### Aplikacja ManagMe - starter

Budujemy aplikację do zarządzania projektami.

- [] Zrealizuj funkcjonalność CRUD dotyczącą projektu.
- [] Dane zapisz w localStorage - napisz dedykowaną klasę do komunikacji z api (tymczasowym api będzie localStorage)

Model projektu: id, nazwa, opis

## Lab2

### Użytkownik

- [] zamodeluj klasę zarządzającą zalogowanym użytkownikiem. Na ten moment chcemy mock zalogowanego użytkownika (bez opcji logowania, zakładania konta etc)
- [] wyświetl imię/nazwisko zalogowanego użytkownika

### Aktywny projekt

- [] Zrealizuj w aplikacji wybór "aktualnego" projektu. Czyli wybieram projekt, apka go zapamiętuje (api) i do czasu zmiany wszystko co widzę w aplikacji jest związane jedynie z tym projektem.

### Historyjki (funkcjonalności) projektu

- [] Zrealizuj CRUD do historyjki (funkcjonalności) w projekcie
- [] Historyjki powinny się zapisywać za pośrednictwem zaprojektowanej poprzednio klasy do komunikacji z api
- [] Widok listy historyjek powininen dzielić historyjki na aktualnie wykonywane, czekające na wykonanie i zamknięte (lub jedna lista z filtrowaniem)

Model użytkownika: id, imię, nazwisko  
Model historyjki: id, nazwa, opis, priorytet (niski/średni/wysoki), projekt, data utworzenia, stan (todo/doing/done), właściciel (id użytkownika)

## Lab3

### Użytkownicy

- [] Rozbuduj model użytkownika o rolę. Możliwe role: admin, devops, developer.
- [] Zamockuj listę użytkowników. Zalogowany pozostaje admin, na liście powinien być jeszcze minimum jeden developer i jeden devops

### Zadania

Zadanie to najmniejsza jednostka projektu. Jest wykonywana przez jedną osobę, jest przypisane do konkretnej historyjki, jest możliwe do zamknięcia.

- [] Zrealizuj CRUD do zadania.
- [] Zrealizuj widok szczegółów zadania - dane zadania, przypisana historyjka, data startu, zrealizowane roboczogodziny, przypisana osoba
- [] Widok szczegółów zadania (lub dodatkowy widok) powinien dostarczać możliwość przypisania osoby do zadania (devops lub developer). Przypisanie osoby automatycznie zmienia stan zadania z "todo" na "doing" oraz uzupełnia datę startu zadania.
- [] Widok szczegółów zadania (lub dodatkowy widok) powinien dostarczać możliwość zmiany stanu zadania na "done". Zmiana stanu automatycznie uzupełnia datę zakończenia zadania.
- [] Zrealizuj widok tablicy kanban z zadaniami (kolumny todo, doing, done)
- [] Zadania powinny się zapisywać za pośrednictwem mechanizmu komunikacji z api

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

- [] Utwórz formularz logowania (pola: login, hasło)
- [] Dane powinny zostać wysłane do API (zaprojektuj endpoint)

### API

- [] zaprojektuj endpoint do logowania - pobiera login i hasło, weryfikuje i zwraca token (JWT) i refreshToken lub błąd
- [] zaprojektuj endpoint do odświeżania tokenu JWT
- [] zaprojektuj endpoint do pobrania danych aktualnie zalogowanego użytkownika (pełny model użytkownika bez hasła)

### Technologie

Wykorzystaj dowolną technologię do utworzenia API - co lubisz. Jeśli nie masz pomysłu - przykładowy starter API znajdziesz w /miniapi (oparty o Node i bibliotekę Express)
