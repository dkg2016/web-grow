class Toast {
  constructor() {
    const hostView =  document.createElement('div');
    hostView.setAttribute('class', 'toast-wrap');
    this.hostView = hostView;
    document.body.appendChild(this.hostView);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Toast();
    }
    return this.instance;
  }

  create(text) {
    this.hostView.innerText = text;
    this.hostView.style.display = 'block';
    setTimeout(() => {
      this.hostView.style.display = 'none';
    }, 1500)
  }
}

export default Toast.getInstance();