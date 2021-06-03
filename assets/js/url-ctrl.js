import { navigator } from 'https://cdn.skypack.dev/@hotwired/turbo';
export default class URLCtrl extends Stimulus.Controller {
  // from: https://gist.github.com/Intrepidd/ac68cb7dfd17d422374807efb6bf2f42
  connect () {
    StimulusUse.useMutation(this, { attributes: true });
    StimulusUse.useDispatch(this);
  }

  mutate (entries) {
    entries.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
        const src = this.element.getAttribute('src');
        if (src != null) { 
          navigator.history.push(new URL(src));
          this.notifyVisitedAdd();
        }
      }
    })
  }

  notifyVisitedAdd() {
    this.dispatch('notifyVisitedAdd');
  }
}
