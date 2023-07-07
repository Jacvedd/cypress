/// <reference types="cypress" />




///////////////////////////////////////
// VARIABLES
//////////////////////////////////////

const memberId = "64a5f283a83ff918a59ee96b";
const apiKey = "c554aa5018f50568eea895378c433018";
const token = "ATTA7c7b7a5d4fe5abd1f3aceff7721027cc3cdfc0c0d17ee994937fd516cc01ebceC5E723AC";





///////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////
const callApi = (url, method) => {
  return cy.request({
    url: url,
    method: method,
    qs: {
      key: apiKey,
      token: token
    }
  });
}

const getOrganizationsByMember = async () => {
  return await callApi(`/members/${memberId}/organizations`, "GET");
}

const createOrganization = async () => {
  const name = `Nova_Area_Trabalho_${Date.now()}`;
  return await callApi(`/organizations?displayName=${name}`, "POST");
}

const getOrganization = async () => {
  const responseOrganizations = await getOrganizationsByMember();
  const organizations = responseOrganizations;
  let idOrganization;

  if (!organizations || organizations && organizations.length < 0) {
    const responseOrganization = await createOrganization();
    idOrganization = responseOrganization.body.id;

  } else {
    const listOrgs = organizations.body;
    idOrganization = listOrgs[Math.floor(Math.random() * listOrgs.length)].id;
  }
  return idOrganization;
}

const getBoard = async () => {
  let idBoard;
  const idOrganization = await getOrganization();
  const boards = await callApi(`/organizations/${idOrganization}/boards`, "GET");

  if (!boards || boards && boards.body.length < 0) {
    const responseCreateBoard = await createBoard();
    idBoard = responseCreateBoard.body.id;

  } else {
    const listBoards = boards.body;
    idBoard = listBoards[Math.floor(Math.random() * listBoards.length)].id;
  }
  return idBoard;
}

const createBoard = async () => {
  const name = `Novo_Board_${Date.now()}`;
  return await callApi(`/boards?name=${name}`, "POST");
}

const createList = async () => {
  const idBoard = await getBoard();
  const name = `Nova_Lista_${Date.now()}`;
  return await callApi(`lists?name=${name}&idBoard=${idBoard}`, "POST");
}

const createCard = async () => {
  let idList;
  const lists = await getList();

  debugger;
  if (!lists || lists && lists.body.length < 0) {
    const responseCreateList = await createList();
    idList = responseCreateList.body.id;

  } else {
    const listBoards = lists.body;
    idList = listBoards[Math.floor(Math.random() * listBoards.length)].id;

    const name = `Novo_Card_${Date.now()}`;
    return await callApi(`/cards?name=${name}&idList=${idList}`, "POST");
  }
}

const getCard = async () => {
  let idCard;
  const idBoard = await getBoard();
  const cards = await callApi(`/boards/${idBoard}/cards`, "GET");

  if (!cards || cards && cards.body.length < 0) {

    const responseCreateCard = await createCard();
    idCard = responseCreateCard.body.id;

  } else {
    idCard = cards.body.id;
  }
  return idCard;
}

const getList = async () => {
  const idBoard = await getBoard();
  return await callApi(`/boards/${idBoard}/lists`, "GET");
}




///////////////////////////////////////
// TESTS
///////////////////////////////////////
describe("Testes Automatizados - Cypress + Trello.com", () => {

  it("Deve cadastrar um board", async () => {
    const responseCreateBoard = await createBoard();
    expect(responseCreateBoard.status).to.equals(200);
  });

  it("Deve cadastrar um card", async () => {
    const responseCreateCard = await createCard();
    expect(responseCreateCard.status).to.equals(200);
  });

  it("Deve excluir um card", async () => {
    const idCard = await getCard();
    const responseDeleteCard = await callApi(`/cards/${idCard}`, "DELETE");
    expect(responseDeleteCard.status).to.equals(200);
  });


  it("Deve excluir um board", async () => {
    const idBoard = await getBoard();
    const responseDeleteBoard = await callApi(`/boards/${idBoard}`, "DELETE");
    expect(responseDeleteBoard.status).to.equals(200);
  });

});