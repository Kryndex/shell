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

const common = require('../../../../lib/common'),
      openwhisk = require('../../../../lib/openwhisk'),
      ui = require('../../../../lib/ui'),
      assert = require('assert'),
      keys = ui.keys,
      cli = ui.cli,
      sidecar = ui.sidecar,
      actionName = 'foo',
      packageName = 'ppp'

describe('Add parameters to packages', function() {
    before(common.before(this))
    after(common.after(this))

    it('should have an active repl', () => cli.waitForRepl(this.app))

    // create an action, using the implicit entity type
    it('should create a packaged action', () => cli.do(`let ${packageName}/${actionName} = ./data/foo.js`, this.app)
        .then(cli.expectOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing(actionName, undefined, undefined, packageName)))

    it('should add a parameter with explicit package name', () => cli.do(`package set x=1 in ${packageName}`, this.app)
        .then(cli.expectJustOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing(packageName))
       .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .package-source`))
       .then(ui.expectStruct({"x":1})))

    it('should add a parameter with implicit package name', () => cli.do('set y=1', this.app)
        .then(cli.expectJustOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing(packageName))
       .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .package-source`))
       .then(ui.expectStruct(({"x":1,"y":1}))))

    it('should update a parameter value with implicit package name', () => cli.do('set x=2', this.app)
        .then(cli.expectJustOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing(packageName))
       .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .package-source`))
       .then(ui.expectStruct({"x":2,"y":1})))
})
