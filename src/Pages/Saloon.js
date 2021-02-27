import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";


function Saloon() {

  const [menu, setMenu] = useState([]);
  const [clientName, setClientName] = useState("");
  const [table, setTable] = useState("");
  const productsList = [];
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [itensMenu, setItens] = useState([]);

  function logout() {
    localStorage.clear();
    history.push("/");
  }

  useEffect(() => { 
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `${token}`);
  
     const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch("https://lab-api-bq.herokuapp.com/products", requestOptions) 
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setMenu(result)
      })
      .catch(error => console.log("error", error));
  }, [])

  function clientOrder(clientName, table, productsList) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `${token}`);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ "client": {clientName}, "table": {table}, "products": {productsList} });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("https://lab-api-bq.herokuapp.com/orders", requestOptions)
      .then(response => response.json())
      .then(result => setMenu(result))
      .catch(error => console.log("error", error));
  }
  
  function handleClick (item) {
    item.qtd = 1;
    item.subtotal = item.price;
    setItens([...itensMenu, item]);
    console.log(item);
  }

  function handleOrder(event) {
    event.preventDefault();
    console.log(clientName, table, productsList);
  }

  const additionProduct = (event, item, index) => {
    event.preventDefault();
    let quantItemAdd = [...itensMenu];
    let subtotalAdd = quantItemAdd[index].price;
    quantItemAdd[index].qtd +=1;
    item.subtotal = subtotalAdd * item.qtd;
    setItens(quantItemAdd);
    console.log(quantItemAdd);
  }

  const subtractionProduct = (event, item, index) => {
    event.preventDefault();
    let quantItemSub = [...itensMenu];
    let subtotalSub = quantItemSub[index].price;
    quantItemSub[index].qtd -=1;
    item.subtotal = subtotalSub * item.qtd;
    if (item.qtd <= 0 || item.subtotal <= 0) {
      // apagar item - função excluir?
    }
    setItens(quantItemSub);
    console.log(quantItemSub);
  }


  return (
    <div className="saloon-page">
      <h1>Salão</h1>
      <button onClick={(event) => logout(event)}>Sair</button>
      
      <main>
        <section className="menu-area">
          {
            menu.map((menuItem, index) => {
              return (
                <div className="products" key={index}>
                  <button className="choose-item-btn" onClick={() => handleClick(menuItem)}>Adicionar</button>
                  <ul>
                    <li>{menuItem.name}</li>
                    <li>{menuItem.flavor}</li>
                    <li>{menuItem.complement}</li>
                    <li>R$ {menuItem.price}</li>
                    {/* <li>{menuItem.type}</li>
                    <li>{menuItem.sub_type}</li> */}
                  </ul>
                </div>
              )
            })
          }
        </section>

        <aside className="order-info">
          <div className="order-details">
            <label>
              Cliente:
              <input type="text" value={clientName} onChange={(event) => setClientName(event.target.value)} />
            </label>
            <label>
              Mesa:
              <input type="text" value={table} onChange={(event) => setTable(event.target.value)} />
            </label>
            <br /><button className="post-order-btn" onClick={(event) => handleOrder(event)}>Enviar Pedido</button> 
          </div>

          <section>
            {
              // itensMenu.length !== 0 &&
              itensMenu.map((item, index) => {
                let orderItem = {
                  id: item.id,
                  qtd: item.qtd
                }
                productsList.push(orderItem);
                return (
                  <div key={index} className="order-summary">
                    <ul>
                      <li>{item.name}</li>
                      <li>{item.flavor}</li>
                      <li>{item.complement}</li>
                      <li>R$ {item.subtotal}</li>
                    </ul>
                    <button className="qtd-item-btn" disabled={item.qtd === 0} onClick={(event) => subtractionProduct(event, item, index)}>-</button>
                    {item.qtd}
                    <button className="qtd-item-btn" onClick={(event) => additionProduct(event, item, index)}>+</button>
                  </div>
                )
              })
            }
          </section>
        </aside>
      </main>
    </div>
  )
}

export default Saloon;
