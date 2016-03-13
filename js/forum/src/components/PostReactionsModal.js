import Modal from 'flarum/components/Modal';
import avatar from 'flarum/helpers/avatar';
import username from 'flarum/helpers/username';

//#DEBUG export default class PostLikesModal extends Modal {
export default class PostReactionsModal extends Modal {
  className() {
    //#DEBUG return 'PostLikesModal Modal--small';
    return 'PostReactionsModal Modal--small';
  }

  title() {
    return app.translator.trans('flarum-likes.forum.post_likes.title');
  }

  //#DEBUG <ul className="PostLikesModal-list">
  //#DEBUG {this.props.post.likes().map(user =>
  content() {
    return (
      <div className="Modal-body">
        <ul className="PostReactionsModal-list">
          {this.props.post.reactions().map(user => (
            <li>
              <a href={app.route.user(user)} config={m.route}>
                {avatar(user)} {' '}
                {username(user)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
