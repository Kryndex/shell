/*
 * Copyright 2017 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs'),
      del = require('del'),
      common = require('../../../lib/common'),
      openwhisk = require('../../../lib/openwhisk'),
      ui = require('../../../lib/ui'),
      assert = require('assert'),
      keys = ui.keys,
      cli = ui.cli,
      sidecar = ui.sidecar,
      PNG_INPUT = '../assets/icons/png/OpenWhisk-512x512.png',
      CSS_INPUT = './data/style.css',
      actionName1 = 'foo1',
      actionName2 = 'foo2',
      actionName3 = 'foo3',
      seqName1 = 's1',
      seqName2 = 's2',
      packageName1 = 'ppp1'

describe('Create anonymous actions via let', function() {
    before(common.before(this))
    after(common.after(this))

    it('should have an active repl', () => cli.waitForRepl(this.app))

    it('should create an anonymous function with () param', () => cli.do(`let ${actionName1} = () => ({x:3})`, this.app)
	.then(cli.expectJustOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing(actionName1)))
    it('should do an invoke of the action, using implicit context', () => cli.do(`invoke -p y 8fdsfdas`, this.app)
	.then(cli.expectJustOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing(actionName1))
       .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
       .then(ui.expectStruct({"x":3})))

    it('should create an anonymous function with _ param', () => cli.do(`let ${actionName2} = _ => ({xx:33})`, this.app)
	.then(cli.expectJustOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing(actionName2)))
    it('should do an invoke of the action, using implicit context', () => cli.do(`invoke -p y 8fdsfdas`, this.app)
	.then(cli.expectJustOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing(actionName2))
       .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
       .then(ui.expectStruct({"xx":33})))

    it('should create an anonymous packaged function with () param', () => cli.do(`let ${seqName1} = ()=>({z:4}) -> x=>x`, this.app)
	.then(cli.expectJustOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing(seqName1)))
    it('should do an invoke of the action, using implicit context', () => cli.do(`invoke -p y 8fdsfdas`, this.app)
	.then(cli.expectJustOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing(seqName1))
       .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
       .then(ui.expectStruct({"z":4})))

    it('should create an anonymous packaged function with _ param', () => cli.do(`let ${seqName2} = _=>({zz:44}) -> x=>x`, this.app)
	.then(cli.expectJustOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing(seqName2)))
    it('should do an invoke of the action, using implicit context', () => cli.do(`invoke -p y 8fdsfdas`, this.app)
	.then(cli.expectJustOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing(seqName2))
       .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
       .then(ui.expectStruct({"zz":44})))

})
