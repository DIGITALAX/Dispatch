import { useState } from "react"

const useValidate = () => {
    const [connected, setConnected] = useState<boolean>()
    const { id } = useContext(UUIDContext)
  
    async function connect() {
      const resourceId = {
        baseUrl: 'http://localhost:3000',
        path: '/protected',
        orgId: "",
        role: "",
        extraData: id
      }
  
      const client = new LitJsSdk.LitNodeClient({ alertWhenUnauthorized: false })
      await client.connect()
      const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: 'ethereum'})
  
      await client.saveSigningCondition({ accessControlConditions, chain: 'ethereum', authSig, resourceId })
      try {
        const jwt = await client.getSignedToken({
          accessControlConditions, chain: 'ethereum', authSig, resourceId: resourceId
        })
        Cookies.set('lit-auth', jwt, { expires: 1 })
  
      } catch (err) {
        console.log('error: ', err)
      }
      setConnected(true)
  
    }
}

export default useValidate;