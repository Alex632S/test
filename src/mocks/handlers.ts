import { http, HttpResponse } from 'msw'
import dataJson from './data/data.json'
import namesJson from './data/names.json'

export const handlers = [
  http.get('/data', () => HttpResponse.json(dataJson)),
  http.get('/names', () => HttpResponse.json(namesJson)),
]