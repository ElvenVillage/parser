import axios from 'axios';
import { load } from 'cheerio';

const SEARCH_STRING = 'SEARCH_STRING';

const baseUrl = `
https://zakupki.gov.ru/epz/contract/search/results.html?searchString=SEARCH_STRING&
morphology=on&
fz44=on&
contractStageList_0=on&
contractStageList_1=on&
contractStageList_2=on&
contractStageList_3=on&
contractStageList=0%2C1%2C2%2C3&
selectedContractDataChanges=ANY&
contractCurrencyID=-1&
budgetLevelsIdNameHidden=%7B%7D&
countryRegIdNameHidden=%7B%7D&
sortBy=UPDATE_DATE&
pageNumber=1&
sortDirection=false&
recordsPerPage=_10&
showLotsInfoHidden=false
`;

export async function parse(region, item) {

  const urlForList = encodeURI(baseUrl
    .split('\n').join('')
    .replace(SEARCH_STRING, region + ' ' + item)
  );

  const content = await axios.get(urlForList);
  const $ = load(content.data);

  const a = $('div:contains("Объекты закупки")');
  const t = $($(a[9]).parent().children()[1]).text().trim();

  if (t.includes('Посмотреть все')) {
    const link = $('a:contains("Посмотреть все")').first().attr('href');
    const add_info_link = 'https://zakupki.gov.ru/' + link;
    const uri = new URL(add_info_link);
    const reestrNumber = uri.searchParams.get('reestrNumber');

    const uriForAdditinalData = new URL('https://zakupki.gov.ru/epz/contract/contractCard/payment-info-and-target-of-order-list.html?reestrNumber=1602700129921000136&contractInfoId=67640713&page=1&pageSize=20');
    uriForAdditinalData.searchParams.set('reestrNumber', reestrNumber);

    const addInfoContent = await axios.get(uriForAdditinalData.toString());
    const $$ = load(addInfoContent.data);

    const subs = $$(`div:contains("${item}")`).first();
    return $$(subs.parent().parent().children()[5]).text().trim() + '\n' + uriForAdditinalData.toString();


  }
  else {
    const price = $('div[class=price-block__value]').first().text();
    return price + '\n' + urlForList.toString();
  }
}