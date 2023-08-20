// ---------------------API ENDPOINT URL ---------------------------------
const apiUrl =
  "http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}";

const tableData = document.getElementById("table-data");
const infoWrapper = document.getElementById("info-wrapper");

// ---------------------------------Fetching the Data From Given API END point -------------

async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//--------------------------------------- creation Of Dynamic Table  --------------------------
// -------Creating Table ROW ---------
function createTableRow(user) {
  const row = document.createElement("tr");
  row.classList.add("data-row");
  row.innerHTML = `
        <td class="column1">${user.id}</td>
        <td class="column2">${user.firstName}</td>
        <td class="column3">${user.lastName}</td>
        <td class="column4">${user.email}</td>
        <td class="column5">${user.phone}</td>
    `;
  return row;
}
//------ Update the table Data---

function updateDetailsBox(user) {
  infoWrapper.innerHTML = `
        <h1>Details</h1>
        <div><b>User selected:</b> ${user.firstName} ${user.lastName}</div>
        <div><b>Description:</b> ${user.description}</div>
        <div><b>Address:</b> ${user.address.streetAddress}</div>
        <div><b>City:</b> ${user.address.city}</div>
        <div><b>State:</b> ${user.address.state}</div>
        <div><b>Zip:</b> ${user.address.zip}</div>
    `;
}

//---------------------------------------Search functionality-------------------------------

function highlightText(text, searchTerm, isFirstRow) {
  const regex = new RegExp(`(${searchTerm})`, "gi");
  const highlightClass = isFirstRow ? "highlight-orange" : "highlight";
  return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
}

async function populateTable() {
  const users = await fetchData();
  const tbody = tableData.querySelector("tbody");
  tbody.innerHTML = "";

  users.forEach((user, index) => {
    const row = createTableRow(user);
    row.addEventListener("click", () => {
      updateDetailsBox(user);
    });
    tbody.appendChild(row);
  });
}

const searchBox = document.getElementById("search-box");
searchBox.addEventListener("input", () => {
  const searchText = searchBox.value.toLowerCase();
  const rows = tableData.querySelectorAll(".data-row");

  rows.forEach((row, index) => {
    const cells = row.querySelectorAll("td");
    let found = false;

    cells.forEach((cell) => {
      const cellText = cell.textContent.toLowerCase();
      const isFirstRow = index === 0;

      if (cellText.includes(searchText)) {
        const highlightedText = highlightText(cellText, searchText, isFirstRow);
        cell.innerHTML = highlightedText;
        found = true;
      } else {
        cell.textContent = cellText;
      }
    });

    if (found) {
      row.style.display = "table-row";
    } else {
      row.style.display = "none";
    }
  });
});

populateTable();
