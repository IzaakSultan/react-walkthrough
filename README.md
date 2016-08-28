# react-walkthrough
[![Build Status](https://travis-ci.org/IzaakSultan/react-walkthrough.svg?branch=master)](https://travis-ci.org/IzaakSultan/react-walkthrough)
[![Coverage Status](https://coveralls.io/repos/github/IzaakSultan/react-walkthrough/badge.svg?branch=master)](https://coveralls.io/github/IzaakSultan/react-walkthrough?branch=master)

Simple declarative user walkthroughs and onboarding with React

### Example
[https://izaaksultan.github.io/react-walkthrough](https://izaaksultan.github.io/react-walkthrough)

### Installation
`npm install react-walkthrough`

## Usage

```javascript
import {Walkthrough, Beacon, Modal} from 'react-walkthrough';

class Example extends React.Component {
    render() {
        return (
            <Walkthrough>
                <div>
                    <h1>Walkthrough Example</h1>
                    <Beacon id="first-button" title="The first button" description="This is the first button">
                        <button>First Button</button>
                    </Beacon>
                </div>
            </Walkthrough>
        )
    }
}
```
