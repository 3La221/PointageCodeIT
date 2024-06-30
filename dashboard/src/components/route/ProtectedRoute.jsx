import { getUser } from '../../helpers/actions'
import React from 'react'

const ProtectedRoute = ({children}) => {
    const user = getUser()

  return user ? children : <h1>You are not authenticated</h1>
}

export default ProtectedRoute
