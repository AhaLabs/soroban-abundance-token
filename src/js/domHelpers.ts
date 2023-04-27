import render from './render'

/**
 * Get all elements with `data-behavior` matching given `selector`, with type
 * cast to HTMLElement rather than generic Element
 */
const getAll = (selector: string) => Array.from(document.querySelectorAll(`[data-behavior=${selector}`) as NodeListOf<HTMLElement>)

/**
 * Update DOM elements that have a "data-behavior" attribute
 * Given `<span data-behavior="thing"></span>`
 * You can `fill('thing').with('whatever')` to set the innerHTML
 */
export const fill = (selector: string) => ({
  with: (content: string) =>
    getAll(selector).forEach(n => {
      n.innerHTML = content
      if (n.className.match('clip')) {
        n.title = content
      }
    })
})

/**
 * Hide DOM elements that have the given "data-behavior" attribute
 */
export const hide = (selector: string) =>
  getAll(selector).forEach(n => { n.style.display = 'none' })

/**
 * Hide DOM elements that have the given "data-behavior" attribute
 */
export const show = (selector: string, display?: string) =>
  getAll(selector).forEach(n => {
    if (display) {
      n.style.display = display
    } else {
      n.style.removeProperty('display')
    }
  })

// DOM handlers to be added once after page load
export const initDOMhandlers = () => {
  (document.querySelector('[data-behavior=logout]') as HTMLElement).onclick = async function logout () {
    await window.web3Modal.clearCachedProvider()
    setTimeout(() => window.location.reload())
  }

  document.querySelectorAll('.dropdown').forEach(d => {
    document.querySelector('body')!.addEventListener('click', event => {
      const button = d.querySelector('button')!
      const clickedAnElement = event.target instanceof Element
      const clickedButton = clickedAnElement && button.contains(event.target)
      const clickedInDropdown = clickedAnElement && d.contains(event.target)
      const classNames = Array.from(d.classList)
      const active = classNames.includes('active')

      if (!active) {
        if (clickedButton) {
          d.className = [...classNames, 'active'].join(' ')
        }
      } else {
        if (clickedButton || !clickedInDropdown) {
          d.className = classNames.filter(c => c !== 'active').join(' ')
        }
      }
    })
  });

  (document.querySelector('input#amount') as HTMLInputElement).oninput = (event) => {
    const submitButton = document.querySelector('main form button') as HTMLButtonElement
    const input = event.target as HTMLInputElement

    if (Number(input.value) > 0) {
      submitButton.disabled = false
    } else {
      submitButton.disabled = true
    }
  }

  (document.querySelector('main form') as HTMLFormElement).onsubmit = async (event) => {
    event.preventDefault()
    const input = event.target as HTMLFormElement

    // get elements from the form using their id attribute
    const { amount, fieldset, submit } = input.elements as unknown as {
      amount: HTMLInputElement
      fieldset: HTMLFieldSetElement
      submit: HTMLButtonElement
    }

    // disable the form while the tokens get locked in Ethereum
    fieldset.disabled = true

    try {
      const minting = await window.erc20.mint(amount.value)
      await minting.wait(2)
    } catch (e) {
      alert(
        'Something went wrong! ' +
        'Maybe you need to sign out and back in? ' +
        'Check your browser console for more info.'
      )
      throw e
    } finally {
      // re-enable the form, whether the call succeeded or failed
      fieldset.disabled = false
    }

    // if the call succeeded, reset the form
    amount.value = ''
    submit.disabled = true
    render()
  }
}
