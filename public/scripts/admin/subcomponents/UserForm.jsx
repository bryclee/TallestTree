var React = require('react');
var Router = require('react-router');
var Form = require('../../shared/form.jsx');
var utils = require('../../shared/utils.jsx');

var UserForm = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    member: React.PropTypes.object,
  },
  mixins: [Router.Navigation],
  componentDidMount: function() {
    // If a member is provided, fill in the input fields with that member's current info
    utils.fillRefs(this.props.member, this.refs, FORM_REFS);
  },
  confirmDelete: function() {
    this.transitionTo('deleteUser', {user: this.props.member.id});
  },
  exitView: function() {
    this.transitionTo('dashboard');
  },
  getInitialState: function() {
    return {error: null};
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.setState({error: null});

    var member = utils.pullRefs(this.refs, FORM_REFS);
    // Validation
    if (!member) {
      return;
    }
    if (member.phone) {
      member.phone = utils.parsePhone(member.phone);
      if (member.phone === false) {
        //TODO: Display error for phone number format (must have 10 numbers)
        alert('Phone number required to have 10 digits (eg. (123)456-7890)');
        return;
      }
    }

    if (this.props.member) {
      member.id = this.props.member.id;
    }

    var method;
    if (this.props.url.match(/update/)) {
      method = 'PUT';
    } else {
      method = 'POST';
    }

    utils.makeRequest({
      url: '/api/users' + (method==='PUT' ? '/'+member.id : ''),
      method: method,
      data: member,
      success: function(data) {
        // TODO: Add confirmation of user add
        this.transitionTo('dashboard');
      }.bind(this),
      error: function(error) {
        this.setState({error: error});
      }.bind(this)
    });
  },
  render: function() {
    var deleteButton;
    if (this.props.member) {
      deleteButton = (
        <button type="button" onClick={this.confirmDelete} className="btn btn-default dashboard-medium dashboard-button-medium dashboard-button-red">Delete User</button>
      );
    }
    return (
      <div className="col-xs-8 col-xs-push-2 dashboard-content">
        <div className="row text-center dashboard-large">{this.props.title}</div>
        <div className="row dashboard-directory">
          <Form.Form error={this.state.error} onSubmit={this.handleSubmit}>
            <Form.Input label="First Name" type="text" ref="first_name" />
            <Form.Input label="Last Name" type="text" ref="last_name" />
            <Form.Input label="Title" type="text" ref="title" />
            <Form.Input label="Email" type="email" ref="email" />
            <Form.Input label="Phone" type="tel" ref="phone" />
            <Form.Input label="Photo URL" type="url" ref="photo" />
            <div className="col-md-6">
              <button type="submit" className="btn btn-default dashboard-medium dashboard-button-medium">Submit</button>
            </div>
            <div className="col-md-6">
              <button type="button" onClick={this.exitView} className="btn btn-default dashboard-medium dashboard-button-medium">Cancel</button>
            </div>
            <div className="col-xs-6 col-xs-push-3 col-md-8 col-md-push-2">
              {deleteButton}
            </div>
          </Form.Form>
        </div>
      </div>
    );
  }
});

var FORM_REFS = {
  required: [
    'first_name',
    'last_name',
    'email'
  ],
  optional: [
    'title',
    'phone',
    'photo'
  ]
};

module.exports = UserForm;
