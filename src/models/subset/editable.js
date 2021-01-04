export const editable = (state = {}) => ({

    isNew() {
        // console.debug('isNew', !state.createdDate);

        return !state.createdDate;
    },

    isLatestPublishedVersion() {
        //console.debug('isLatestSavedVersion');

        if (!state.versions) {
            return null;
        }
        return state.latestPublishedVersion?.version === state.version;
    },

    isNewVersion() {
        //console.debug('isNewVersion', state.administrativeStatus === 'INTERNAL' && state.version !== '1');

        return state.administrativeStatus === 'INTERNAL'
            && state.version !== '1';
    },

    /*    isAfterCoveredPeriod(date) {
            //console.debug('isAfterCoveredPeriod');

            return date
                && (date >= state.latestVersion?.validUntil
                    || date > state.latestVersion?.versionValidFrom);
        },

        isBeforeCoveredPeriod(date) {
            //console.debug('isBeforeCoveredPeriod');

            return date
                && state.isInAcceptablePeriod(date)
                && date < state.validFrom;
        },

        isInCoveredPeriod(date) {
            const start = state.latestVersion?.validFrom || state._validFrom;
            const end = state.latestVersion
                ? state.latestVersion?.validUntil || state.latestVersion?.versionValidFrom
                : state._validUntil;
            return !end
                ? date === start
                : end === state.latestVersion?.versionValidFrom
                    ? date >= start && date <= end
                    : date >= start && date < end;
        },*/

    isEditableId() {
        return state.isNew();
    },

    isEditableShortName() {
        return true;
    },

    isEditableName() {
        return true;
    },

    isEditableStatus() {
        return true;
    },

    isEditableOwningSection() {
        return true;
    },

    isEditableClassificationFamily() {
        return true;
    },

    isEditableVersionValidFrom() {
        //console.debug('isEditableVersionValidFrom');

        return !state.isPublished
    },

    isEditableVersionValidUntil() {
        //console.debug('isEditableVersionValidUntil');

        return !state.isPublished || state.isLatestPublishedVersion();
    },

    isEditableOrigins() {
        return !state.isPublished;
    },

    isEditableDescription() {
        return true;
    },

    isEditableVersionRationale() {
        return !state.isPublished;
    },

    isEditableCodes() {
        console.debug('isEditableCodes ', !state.isPublished)
        return !state.isPublished;
    }
});