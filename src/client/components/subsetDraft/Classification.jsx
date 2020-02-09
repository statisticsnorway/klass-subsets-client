import React, {useState} from 'react';
import {PlusSquare, MinusSquare, XSquare, Trash2, Info,
    List as ListIcon, AlertTriangle as Alert} from 'react-feather';
import {Text, Paragraph} from '@statisticsnorway/ssb-component-library';
import {useGet} from '../../controllers/klass-api';

export const Classification = ({item, update, add, remove, checkbox = false}) => {

    const id = item._links.self.href.split("/").pop();

    const check = {
        hasCodes: () => (item.codes && item.codes.length > 0),
        includible: () => (!item.included && item.codes && item.codes.length > 0)
    };

    const toggle = {
        closeAll: () => ({
            showAlert: false,
            showCodes: false,
            showCannot: false,
            showInfo: false
        }),
        alert: () => ({
            showAlert: !expander.showAlert,
            showCodes: false,
            showCannot: false,
            showInfo: false
        }),
        codes: () => ({
            showAlert: false,
            showCodes: !expander.showCodes,
            showCannot: false,
            showInfo: false
        }),
        cannot: () => ({
            showAlert: false,
            showCodes: false,
            showCannot: !expander.showCannot,
            showInfo: false
        }),
        info: () => ({
            showAlert: false,
            showCodes: false,
            showCannot: false,
            showInfo: !expander.showInfo
        })
    };

    const [expander, setExpander] = useState(toggle.closeAll());

    const [info] = useGet(`/classifications/${id}`);

    return (
        <>
        <div style={{display: 'flex'}}>
            <div style={{width: '400px'}}>{item.name}</div>

            <button onClick={() => item.error && setExpander(toggle.alert())}>
                <Alert color={item.error ? 'orange' : 'transparent'}/>
            </button>

            {/*TODO: (test case) remove empty classification from draft.classification*/}
            <button onClick={() => {
                if (item.included || check.hasCodes()) {
                    setExpander(toggle.closeAll());
                    item.included = !item.included;
                    add();
                    update();
                } else {setExpander(toggle.cannot());}}}>
                {check.includible() && <PlusSquare color='#1A9D49'/>}
                {item.included && <MinusSquare color='#B6E8B8'/>}
                {!item.included && !check.hasCodes() && <XSquare color='#9272FC' />}
            </button>

            <button onClick={() => setExpander(toggle.codes())}>
                <ListIcon color={check.hasCodes() ? '#3396D2' : '#C3DCDC'}/>
            </button>

            <button onClick={() => setExpander(toggle.info())}>
                <Info color={info ? '#62919A': '#C3DCDC'}/>
            </button>

            <button onClick={() => {
                setExpander(toggle.closeAll());
                remove();
                }}>
                <Trash2 color='#ED5935'/>
            </button>
        </div>

        {expander.showAlert && <div style={{
            backgroundColor: 'AntiqueWhite',
            padding: '15px',
            width: '600px'
        }}><Text>{item.error}</Text></div>}

        {expander.showCannot && <div style={{
                backgroundColor: '#ece6fe',
                padding: '15px',
                width: '600px'
        }}><Text>Code list cannot be added to the subset due to lack of codes</Text></div>}

        {expander.showCodes && <div style={{
            backgroundColor: 'AliceBlue',
            padding: '15px',
            width: '600px'
        }}>
            <div className="ssb-checkbox-group">
                <div className="checkbox-group-header">Codes</div>
                {!check.hasCodes()
                    ? <Text>No codes found for this validity period</Text>
                    : <>
                        {checkbox && <div style={{padding: '5px'}}>
                            <button onClick={() => {
                                item.codes.forEach(code => code.included = true);
                                update();
                                }}>All
                            </button>
                            <button onClick={() => {
                                item.codes.forEach(code => code.included = !code.included);
                                update();
                                }}>Invert
                             </button>
                        </div>}

                        {item.codes.map((code, i) =>
                        !checkbox
                            ? <Paragraph><strong>{code.code}</strong> {code.name}</Paragraph>
                            : <div className="ssb-checkbox">
                                <input id={`${code.code}-${i}`}
                                       type='checkbox' name='include'
                                       checked={code.included}
                                       value={code.code}
                                       onChange={() => {
                                           code.included = !code.included;
                                           update();
                                       }}/>
                                <label className='checkbox-label'
                                       htmlFor={`${code.code}-${i}`}>
                                    <Text><strong>{code.code}</strong> {code.name}</Text>
                                </label>
                            </div>)}
                    </>
                }
            </div>
        </div>}

            {expander.showInfo && <div style={{
                backgroundColor: '#eff4f5',
                padding: '15px',
                width: '600px'
            }}>
                {`ìd=${id} ${JSON.stringify(info)}`}
            </div>}
    </>);
};
/*

{
    "name"
:
    "Standard for gruppering av hjelpe- og omsorgstiltak i barnevernet", "classificationType"
:
    "Klassifikasjon", "lastModified"
:
    "2016-10-07T12:05:23.000+0000", "description"
:
    "For barn som har mottatt barnvernstiltak i statistikkåret registrerer en hvilke tiltak dette er (1-28) og om tiltakene er hjelpe- eller omsorgstiltak. Omsorgstiltak er gjeldende når barneverntjenesten har overtatt omsorgen for barnet via fylkesnemnda.", "primaryLanguage"
:
    "nb", "copyrighted"
:
    false, "includeShortName"
:
    false, "includeNotes"
:
    true, "contactPerson"
:
    {
        "name"
    :
        "Dyrhaug, Tone", "email"
    :
        "Tone.Dyrhaug@ssb.no", "phone"
    :
        "40902420"
    }
,
    "owningSection"
:
    "330 - Seksjon for helse-, omsorg og sosialstatistikk ", "statisticalUnits"
:
    ["Person"], "versions"
:
    [{
        "name": "Gruppering av hjelpe- og omsorgstiltak i barnevernet 2013",
        "validFrom": "2013-01-01",
        "lastModified": "2016-10-07T12:05:23.000+0000",
        "published": ["nb", "en"],
        "_links": {"self": {"href": "https://data.ssb.no/api/klass/v1/versions/15"}}
    }, {
        "name": "Gruppering av hjelpe- og omsorgstiltak i barnevernet 2007",
        "validFrom": "2007-01-01",
        "validTo": "2013-01-01",
        "lastModified": "2016-10-07T12:05:23.000+0000",
        "published": ["nb", "nn", "en"],
        "_links": {"self": {"href": "https://data.ssb.no/api/klass/v1/versions/16"}}
    }, {
        "name": "Gruppering av hjelpe- og omsorgstiltak i barnevernet 2002",
        "validFrom": "2002-01-01",
        "validTo": "2007-01-01",
        "lastModified": "2016-10-07T12:05:23.000+0000",
        "published": ["nb", "nn", "en"],
        "_links": {"self": {"href": "https://data.ssb.no/api/klass/v1/versions/17"}}
    }], "_links"
:
    {
        "self"
    :
        {
            "href"
        :
            "https://data.ssb.no/api/klass/v1/classifications/3"
        }
    ,
        "codes"
    :
        {
            "href"
        :
            "https://data.ssb.no/api/klass/v1/classifications/3/codes{?from=<yyyy-MM-dd>,to=<yyyy-MM-dd>,csvSeparator,level,selectCodes,presentationNamePattern}", "templated"
        :
            true
        }
    ,
        "codesAt"
    :
        {
            "href"
        :
            "https://data.ssb.no/api/klass/v1/classifications/3/codesAt{?date=<yyyy-MM-dd>,csvSeparator,level,selectCodes,presentationNamePattern}", "templated"
        :
            true
        }
    ,
        "variant"
    :
        {
            "href"
        :
            "https://data.ssb.no/api/klass/v1/classifications/3/variant{?variantName,from=<yyyy-MM-dd>,to=<yyyy-MM-dd>,csvSeparator,level,selectCodes,presentationNamePattern}", "templated"
        :
            true
        }
    ,
        "variantAt"
    :
        {
            "href"
        :
            "https://data.ssb.no/api/klass/v1/classifications/3/variantAt{?variantName,date=<yyyy-MM-dd>,csvSeparator,level,selectCodes,presentationNamePattern}", "templated"
        :
            true
        }
    ,
        "corresponds"
    :
        {
            "href"
        :
            "https://data.ssb.no/api/klass/v1/classifications/3/corresponds{?targetClassificationId,from=<yyyy-MM-dd>,to=<yyyy-MM-dd>,csvSeparator}", "templated"
        :
            true
        }
    ,
        "correspondsAt"
    :
        {
            "href"
        :
            "https://data.ssb.no/api/klass/v1/classifications/3/correspondsAt{?targetClassificationId,date=<yyyy-MM-dd>,csvSeparator}", "templated"
        :
            true
        }
    ,
        "changes"
    :
        {
            "href"
        :
            "https://data.ssb.no/api/klass/v1/classifications/3/changes{?from=<yyyy-MM-dd>,to=<yyyy-MM-dd>,csvSeparator}", "templated"
        :
            true
        }
    }
}*/
