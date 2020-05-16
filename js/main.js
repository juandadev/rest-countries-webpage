let countries;
var backHome = document.getElementById('detail__back'),
    SwitchMode = document.querySelector('.header__mode'),
    detail__image = document.querySelector('.detail__image'),
    container__title = document.querySelector('.container__title'),
    info__native = document.querySelector('.info__native'),
    info__population = document.querySelector('.info__population'),
    info__region = document.querySelector('.info__region'),
    info_subRegion = document.querySelector('.info_sub-region'),
    info__capital = document.querySelector('.info__capital'),
    info__top = document.querySelector('.info__top'),
    info__currencies = document.querySelector('.info__currencies'),
    info__language = document.querySelector('.info__language'),
    borderContainer = document.querySelector('.container__info03');

backHome.addEventListener('click', function () {
    document.querySelector('.detail').classList.toggle('hidden');
    document.querySelector('.detail').classList.toggle('flex');
});

SwitchMode.addEventListener('click', function () {
    changeCSS('hola', 'caca');
});

fetch("https://restcountries.eu/rest/v2/all")
    .then((res) => res.json())
    .then((data) => initialize(data))
    .catch((err) => console.log('Error: ' + err));

function initialize(data) {
    var container = document.querySelector('.main__countries');
    countries = data;

    for (let i = 0; i < countries.length; i++) {
        createItem(container, countries[i], i);
    }
}

function createItem(container, data, id) {
    var item = document.createElement('div');
    item.classList.add('countries__item');
    item.setAttribute('id', id);
    item.setAttribute('onclick', 'openDetails(this)');
    container.appendChild(item);

    var itemImage = document.createElement('div');
    itemImage.classList.add('item__image');
    itemImage.style.backgroundImage = `url(${data.flag})`;
    itemImage.style.backgroundSize = 'cover';
    itemImage.style.backgroundRepeat = 'no-repeat';
    itemImage.style.backgroundPosition = 'center center';
    item.appendChild(itemImage);

    var itemName = document.createElement('h2');
    itemName.classList.add('item__name');
    itemName.innerText = data.name;
    item.appendChild(itemName);

    createSpan('Population', data.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), 'item__population', item); // Regular expression separating numbers

    createSpan('Region', data.region, 'item__region', item);

    createSpan('Capital', data.capital, 'item__capital', item);
}

function createSpan(label, content, className, item) {
    var itemP = document.createElement('p');
    itemP.innerText = `${label}: `;
    var spanP = document.createElement('span');
    spanP.classList.add(`${className}`);
    spanP.innerText = content;
    itemP.appendChild(spanP);
    item.appendChild(itemP);
}

function openDetails(item) {
    document.querySelector('.detail').classList.toggle('hidden');
    document.querySelector('.detail').classList.toggle('flex');

    detail__image.style.backgroundImage = `url(${countries[item.id].flag})`;
    detail__image.style.backgroundPosition = 'center center';
    detail__image.style.backgroundRepeat = 'no-repeat';
    detail__image.style.backgroundSize = 'cover';

    container__title.innerText = countries[item.id].name;
    info__native.innerText = countries[item.id].nativeName;
    info__population.innerText = countries[item.id].population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    info__region.innerText = countries[item.id].region;
    info_subRegion.innerText = countries[item.id].subregion;
    info__capital.innerText = countries[item.id].capital;
    info__top.innerText = countries[item.id].topLevelDomain;
    info__currencies.innerText = countries[item.id].currencies[0].name;

    var countryLang = '';

    for (let i = 0; i < countries[item.id].languages.length; i++) {
        countryLang += `${countries[item.id].languages[i].name}, `;
    }

    info__language.innerText = countryLang.substr(0, countryLang.length - 2);

    var countryBorder = [];

    for (let i = 0; i < countries[item.id].borders.length; i++) {
        countryBorder.push(searchCountries('border', countries[item.id].borders[i]));
    }

    borderContainer.innerHTML = '';

    var borderTitle = document.createElement('p');
    borderTitle.innerText = 'Border Countries:';
    borderContainer.appendChild(borderTitle);

    for (let i = 0; i < countryBorder.length; i++) {

        var borderDiv = document.createElement('span');
        borderDiv.classList.add('border');
        borderDiv.innerText = countryBorder[i];
        borderContainer.appendChild(borderDiv);
    }

    if (countryBorder.length == 0) {
        var borderDiv = document.createElement('span');
        borderDiv.classList.add('border');
        borderDiv.innerText = 'None';
        borderContainer.appendChild(borderDiv);
    }
}

function searchCountries(condition, name) {
    switch (condition) {
        case 'border':
            for (let i = 0; i < countries.length; i++) {
                if (countries[i].alpha3Code == name) {
                    var border = countries[i].name;
                }
            }
            break;

        case 'custom':
            var container = document.querySelector('.main__countries');
            container.innerHTML = '';

            for (let i = 0; i < countries.length; i++) {
                var upperName = countries[i].name.toUpperCase();

                if (upperName.includes(`${name.toUpperCase()}`)) {
                    createItem(container, countries[i], i);
                }
            }
            break;

        case 'region':
            var container = document.querySelector('.main__countries');
            container.innerHTML = '';

            for (let i = 0; i < countries.length; i++) {
                var upperRegion = countries[i].region;

                if (upperRegion.includes(`${name}`) && name != 'Default') {
                    createItem(container, countries[i], i);
                } else if (name == 'Default') {
                    createItem(container, countries[i], i);
                }
            }
            break;

        default:
            break;
    }

    return border;
}

function changeCSS(newFile) {
    var oldLink = document.getElementsByTagName('link').item(2).href;

    if (oldLink.includes('light.css')) {
        oldLink = 'css/dark.css';
    } else {
        oldLink = 'css/light.css';
    }
}