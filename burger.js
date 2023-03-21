window.addEventListener('load', (event) => {
    // Queryselector används för att hämta collapse elementet med dess klassnamn
    const collapse = document.querySelector('.navbar__collapse');
    
    // Queryselector används för att hämta button elementet med dess klassnamn
    const button = document.querySelector('.navbar__toggle');
    
    // när knappen trycks vill vi att vår kod ska köras
    // addEventListener används för att lägga till en eventlistener
    // som lyssnar efter tryck på denna knapp
    button.addEventListener('click', () => {
        // collapse är variabeln som innehåller referensen till collapse elementet
        // med toggle så kan vi slå av och på klassnamn för den
        collapse.classList.toggle('navbar__collapse-show');
    }, false);

    // följande kod lyssnar efter en resize på webbläsarfönstret
    // detta för att kolla om hamburgermenyn ska visas eller inte
    const mql = window.matchMedia('(max-width: 768px)');
    mql.addEventListener('change', (e) => {
        if (!e.matches && collapse.classList[1] == 'navbar__collapse-show') {
            collapse.classList.toggle('navbar__collapse-show');
        }
    })
});