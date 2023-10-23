import {API_URL} from 'src/constants/appConstants'

export async function client(
  endpoint,
  {data, token, headers: customHeaders, ...customConfig},
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }

  return window.fetch(`${API_URL}/${endpoint}`, config).then(async response => {
    if (response.status == 401) {
      // Add your logout user function here from another module
      // e.g. auth.logout()
      window.location.assign(window.location)
      return Promise.reject('لطفا دوباره وارد شوید!')
    }

    const data = await response.json()

    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}
