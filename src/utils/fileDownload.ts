export function downloadFile(file: string) {
  const request = new XMLHttpRequest()
  request.responseType = 'blob'

  const fileUrl = file.split('?')
  request.open('GET', fileUrl[0])

  request.onload = function () {
    const url = window.URL.createObjectURL(this.response)
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.href = url
    a.download = fileUrl[0].substring(fileUrl[0].lastIndexOf('/') + 1)
    a.click()
    a.remove()
  }
  request.send()
}