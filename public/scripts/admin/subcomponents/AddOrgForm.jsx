var React = require('react');
var Router = require('react-router');
var Dropdown = require('react-dropdown');
var NavBar = require('./NavBar.jsx');
var Form = require('../../shared/form.jsx');
var utils = require('../../shared/utils.jsx');

var AddOrgForm = React.createClass({
  mixins: [Router.Navigation],
  componentDidMount: function() {
    utils.fillRefs(this.props.org, this.refs, FORM_REFS);
  },
  getInitialState: function() {
    return {error: null};
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.setState({error: null});

    var org = utils.pullRefs(this.refs, FORM_REFS);
    if (!org) {
      return;
    }

    utils.makeRequest({
      url: '/api/orgs',
      method: 'POST',
      data: org,
      success: function(data) {
        this.transitionTo('dashboard');
      }.bind(this),
      error: function(error) {
        this.setState({error: error});
      }.bind(this)
    });
  },
  render: function() {
    if (this.props.org) {
      this.transitionTo('dashboard');
    }

    return (
      <div>
        <NavBar page="dashboard" />
        <div className="col-xs-8 col-xs-push-2 dashboard-content">
          <div className="row text-center dashboard-large">CREATE ORGANIZATION</div>
          <Form.Form error={this.state.error} onSubmit={this.handleSubmit}>
            <Form.Input label="Organization Name" type="text" ref="name" />
            <Form.Input label="Welcome Message" type="text" ref="welcome_message" />
            <Form.Input label="Logo URL" type="url" ref="logo" />
            <div className="col-xs-6 col-xs-push-3 col-md-8 col-md-push-2">
              <button type="submit" className="btn btn-default dashboard-medium dashboard-button-medium">Submit</button>
            </div>
          </Form.Form>
        </div>
      </div>
    );
  }
});

var FORM_REFS = {
  required: [
    'name'
  ],
  optional: [
    'welcome_message',
    'logo'
  ]
};

module.exports = AddOrgForm;
