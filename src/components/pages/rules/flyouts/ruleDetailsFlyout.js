// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { svgs } from 'utilities';
import { permissions, toDiagnosticsModel } from 'services/models';
import { Btn, ComponentArray, Protected, ProtectedError } from 'components/shared';
import { RuleEditorContainer } from './ruleEditor';
import { RuleViewerContainer } from './ruleViewer';
import Flyout from 'components/shared/flyout';

import './ruleDetailsFlyout.css';

export class RuleDetailsFlyout extends Component {
  constructor(props) {
    super(props);

    // Set the initial state
    this.state = {
      isEditable: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.rule || {}).id !== nextProps.rule.id) {
      this.setState({ isEditable: false });
    }
  }

  onTopXClose = () => {
    const { logEvent, onClose } = this.props;
    if (this.state.isEditable) {
      logEvent(toDiagnosticsModel('Rule_TopXCloseClick', {}));
    }
    onClose();
  }

  goToEditMode = () => {
    this.props.logEvent(toDiagnosticsModel('Rule_EditClick', {}));
    this.setState({ isEditable: true });
  }

  render() {
    const { t, onClose, rule } = this.props;
    const { isEditable } = this.state;

    return (
      <Flyout.Container>
        <Flyout.Header>
          <Flyout.Title>{isEditable ? t('rules.flyouts.editRule') : t('rules.flyouts.viewRule')}</Flyout.Title>
          <Flyout.CloseBtn onClick={this.onTopXClose} />
        </Flyout.Header>
        <Flyout.Content className="rule-details">
          {!isEditable
            ?
            <ComponentArray>
              <RuleViewerContainer onClose={onClose} rule={rule} />
              <Protected permission={permissions.updateRules}>
                <Btn className="edit-mode-btn" svg={svgs.edit} onClick={this.goToEditMode}>
                  {t('rules.flyouts.edit')}
                </Btn>
              </Protected>
            </ComponentArray>
            :
            <Protected id="rule-details-edit" permission={permissions.updateRules}>
              {
                (hasPermission, permission) => hasPermission
                  ? <RuleEditorContainer onClose={onClose} rule={rule} />
                  : <ProtectedError t={t} permission={permission} />
              }
            </Protected>
          }
        </Flyout.Content>
      </Flyout.Container>
    );
  }
}
