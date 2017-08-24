class CSSRuleAdder {
  constructor(opts = {}) {
    if (!document.styleSheets || !document.styleSheets.length) {
      throw (`This isn't a browser window. Y u do dis???`);
      return;
    }

    this.capRegExp = new RegExp('[A-Z]');
    this.workingStyleSheet = this.getFirstAvailableSheet();

    if (!this.workingStyleSheet) {
      console.error('No Style Sheets Found');
    }
  }

  getFirstAvailableSheet() {
    for (const key in document.styleSheets) {
      const ss = document.styleSheets[key];
      if (!ss.cssRules) {
        continue;
      }

      if (ss.type === 'text/css') {
        return ss;
      }
    }

    return false;
  }

  appendRule(selector, ruleObj) {
    if (!this.workingStyleSheet) {
      this.getFirstAvailableSheet();
    }

    if (!this.workingStyleSheet) {
      throw ('No Style Sheets Available!');
    }

    const rules = Object.entries(ruleObj).reduce((ruleContent, styleEntry) => {
      let propName = styleEntry[0];
      let newPropName = propName.slice();
      const propValue = styleEntry[1];

      if (this.capRegExp.test(propName)) {
        for (let i = 0; i < propName.length; i++) {
            const letter = propName[i];
            if (this.capRegExp.test(letter)) {
              newPropName = newPropName.replace(letter, `-${letter.toLowerCase()}`);
            }
        }
        propName = newPropName;
      }

      return `${ruleContent}${newPropName}:${propValue};`;
    }, '');

    this.workingStyleSheet.insertRule(`
      ${selector} {
        ${rules}
      }
    `);
  }
}

module.exports = CSSRuleAdder;
