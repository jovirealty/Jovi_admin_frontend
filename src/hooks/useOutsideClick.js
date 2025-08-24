import { useEffect } from 'react'
export default function useOutsideClick(ref, onClose) {
  useEffect(() => {
    function handler(e){ if(ref.current && !ref.current.contains(e.target)) onClose?.() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onClose])
}
