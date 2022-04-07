import axios from 'axios';
import { load } from 'cheerio';

var ready_regions =  [];

const baseUrl = 'https://zakupki.gov.ru/epz/organization/chooseOrganization/chooseOrganizationTableModal.html?searchString=%D1%81%D0%BE%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B3%D0%BE%20%D1%81%D1%82%D1%80%D0%B0%D1%85%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F&inputId=customer&page=1&pageSize=200&organizationType=ALL&placeOfSearch=FZ_94&isBm25Search=true';

async function init() {
    const rawHtml = await axios.get(baseUrl);
    const ready_regions = [];
    const $ = load(rawHtml.data);
    $('input[class=not-hierarchical-list__item-checkbox]').each((_, region) => {
       ready_regions.push( $(region).attr('data-name').toUpperCase() );
    }); 
    return ready_regions;
}

export async function region(region_string) {
    if (ready_regions.length == 0) {
        ready_regions = await init();
    }
    const filtered = ready_regions
        .filter((region) => region.includes(region_string.toUpperCase()));

    return JSON.stringify(filtered);
}
