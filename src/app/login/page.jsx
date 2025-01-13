'use client'
import React from 'react'

import Nav from '../components/Nav'
import {login} from './action'
function loginPage() {
  return (
    <div>
      <Nav/>
      <form action={login}>
        <div>
          Email<input type="text" name='email'/>
        </div>
        <div>
          Password<input type="password" name='password'/>
        </div>
        <button>Login</button>
      </form>
    </div>
  )
}

export default loginPage

