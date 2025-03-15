export const makeEditable = (element: HTMLElement, id: string, currentValue: string, type: 'text' | 'image' | 'richtext' = 'text') => {
  if (window.location.pathname === '/editmode') {
    element.style.cursor = 'pointer'
    element.style.position = 'relative'
    
    // Add hover effect
    element.addEventListener('mouseenter', () => {
      element.style.outline = '2px solid #3b82f6'
      element.style.outlineOffset = '2px'
    })
    
    element.addEventListener('mouseleave', () => {
      element.style.outline = 'none'
    })
    
    element.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      
      window.parent.postMessage({
        type: 'elementClick',
        elementId: id,
        currentValue,
        elementType: type
      }, '*')
    })
  }
} 