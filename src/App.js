import React, { useState, useEffect } from 'react'
import { Form, Field } from 'react-final-form'
import axios from 'axios'

const App = () => {
  const [items, setItems] = useState([])
  const [currencies, setCurrencies] = useState([])
  const [sum, setSum] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()

  const fetchItems = async () => {
    setLoading(true)
    const res = await axios('/items')
    setItems(res.data)
    await setLoading(false)
  }

  const fetchCurrencies = async () => {
    const res = await axios('/currencies')
    setCurrencies(res.data)
  }

  const deleteItem = async (id) => {
    try {
      setLoading(true)
      await axios.delete(`/item/${id}`)
      await fetchItems()
      await setLoading(false)
    } catch (e) {
      setError(e)
    }
  }

  const postItem = async (values) => {
    try {
      setLoading(true)
      await axios.post('/item', values)
      await fetchItems()
      await setLoading(false)
    } catch (e) {
      setError(e)
    }
  }

  const fetchSum = async () => {
    try {
      const res = await axios('/items/sum')
      setSum(res.data)
    } catch (e) {
      setError(e)
    }
  }

  useEffect(() => {
    try {
      fetchCurrencies()
      fetchItems()
    } catch(e) {
      setError(e.response)
    }
  }, [])

  if (error) return <h2>Error: {error.response.data}</h2>

  return (
    <div>
      <h2>Add an item</h2>
      <Form
        onSubmit={postItem}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name='name'
              placeholder='Name'
              component='input'
              type='text'
              required
            />
            <Field
              name='quantity'
              placeholder='Quantity'
              component='input'
              type='number'
              min='0'
              step='1'
              parse={v => v ? +v : ''}
              required
            />
            <Field
              name='price'
              placeholder='Price'
              component='input'
              type='number'
              parse={v => v ? +v : ''}
              required
            />
            <Field
              name='currency'
              component='select'
              required
            >
              <option></option>
              {currencies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </Field>
            <button type='submit'>Add</button>
          </form>
        )}
      />
      {
        loading
          ? <h2>Loading...</h2>
          : (
            <div>
              <h2>Basket</h2>
              <table border='1' cellPadding='10'>
                <tbody>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Currency</th>
                  </tr>
                  {items.map(i => (
                    <tr key={i._id}>
                      <td>{i.name}</td>
                      <td>{i.quantity}</td>
                      <td>{i.price}</td>
                      <td>{i.currency.name}</td>
                      <td>
                        <button
                          type='button'
                          onClick={() => deleteItem(i._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
      }
      <div>
        <h2>Sum</h2>
        <button
          type='button'
          onClick={fetchSum}
        >
          Count
        </button>
        <table border='1' cellPadding='10'>
          <tbody>
            <tr>
              <th>Currency</th>
              <th>Sum</th>
            </tr>
            {
              sum.map(s => (
                <tr key={s.currency}>
                  <td>{s.currency}</td>
                  <td>{s.sum}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
