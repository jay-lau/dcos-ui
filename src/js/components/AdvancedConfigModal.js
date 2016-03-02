import {Confirm} from 'reactjs-components';
import React from 'react';

import ReviewConfig from './ReviewConfig';
import {schema as boomski} from './__tests__/fixtures/MarathonConfigFixture';
import SchemaForm from './SchemaForm';

const METHODS_TO_BIND = [
  'changeReviewState',
  'getTriggerSubmit',
  'handleInstallClick',
  'handleReviewClick',
  'onResize'
];
const MOBILE_WIDTH = 480;

class AdvancedConfigModal extends React.Component {
  constructor() {
    super();

    this.state = {
      isMobileWidth: false,
      reviewingConfig: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillMount() {
    this.setState({isMobileWidth: this.isMobileWidth(global.window)});
    global.window.addEventListener('resize', this.onResize);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open && !this.props.open) {
      this.setState({reviewingConfig: false});
    }
  }

  componentWillUnmount() {
    global.window.removeEventListener('resize', this.onResize);
  }

  changeReviewState(reviewing) {
    this.setState({reviewingConfig: reviewing});
  }

  onResize(e) {
    if (!this.props.open) {
      return;
    }

    let isMobileWidth = this.isMobileWidth(e.target);
    if (isMobileWidth) {
      this.setState({isMobileWidth: true});
    } else if (this.state.isMobileWidth) {
      this.setState({isMobileWidth: false});
    }
  }

  handleInstallClick() {
    console.log('Installing!');
  }

  handleReviewClick() {
    let submitInfo = this.triggerSubmit();

    if (submitInfo.errors === 0) {
      this.model = submitInfo.model;
      this.definition = submitInfo.definition;
      this.changeReviewState(true);
    }

  }

  isMobileWidth(element) {
    return element.innerWidth <= MOBILE_WIDTH;
  }

  isReviewing() {
    return this.state.reviewingConfig;
  }

  getTriggerSubmit(triggerSubmit) {
    this.triggerSubmit = triggerSubmit;
  }

  getLeftButtonText() {
    if (this.isReviewing()) {
      return 'Back';
    }

    return 'Cancel';
  }

  getLeftButtonCallback() {
    if (this.isReviewing()) {
      return this.changeReviewState.bind(this, false);
    }

    return this.props.onClose;
  }

  getRightButtonText() {
    if (this.isReviewing()) {
      return 'Install Package';
    }

    return 'Review and Install';
  }

  getRightButtonCallback() {
    if (this.isReviewing()) {
      return this.handleInstallClick;
    }

    return this.handleReviewClick;
  }

  getModalContents() {
    if (this.isReviewing()) {
      return (
        <ReviewConfig
          jsonDocument={this.model}/>
      );
    }

    return (
      <SchemaForm
        schema={this.props.schema}
        definition={this.definition}
        model={this.model}
        isMobileWidth={this.state.isMobileWidth}
        getTriggerSubmit={this.getTriggerSubmit} />
    );
  }

  render() {
    return (
      <Confirm
        innerBodyClass=""
        leftButtonCallback={this.getLeftButtonCallback()}
        leftButtonClassName="button button-large"
        leftButtonText={this.getLeftButtonText()}
        modalClass="modal modal-large"
        modalWrapperClass="multiple-form-modal"
        onClose={this.props.onClose}
        open={this.props.open}
        rightButtonCallback={this.getRightButtonCallback()}
        rightButtonClassName="button button-success button-large"
        rightButtonText={this.getRightButtonText()}
        titleClass="modal-header-title text-align-center flush">
        {this.getModalContents()}
      </Confirm>
    );
  }
}

AdvancedConfigModal.defaultProps = {
  schema: boomski,
  onClose: function () {},
  open: false
};

AdvancedConfigModal.propTypes = {
  schema: React.PropTypes.object,
  onClose: React.PropTypes.func,
  open: React.PropTypes.bool,
  serviceImage: React.PropTypes.string,
  serviceName: React.PropTypes.string,
  serviceVersion: React.PropTypes.string
};

module.exports = AdvancedConfigModal;
