'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Accept invoice transactions transaction
 * @param {org.meerkat.net.AcceptInvoice} acceptInvoiceTransaction
 * @transaction
 */
function onAcceptInvoice(acceptInvoiceTransaction) {
    var assetRegistry;
    var id = acceptInvoiceTransaction.invoiceId;

    if (acceptInvoiceTransaction.sender.bizEntityId !== acceptInvoiceTransaction.invoice.receiver.bizEntityId) {
        throw new Error("Only receiver of transaction can accept transaction");
    }

        return Promise.resolve()
        .then(function () {
            getAssetRegistry('org.meerkat.net.Invoice')
                .then(function (ar) {
                    assetRegistry = ar;
                    return assetRegistry.get(acceptInvoiceTransaction.invoice.invoiceId);
                })
                .then(function (asset) {
                    asset.status = "ACCEPTED";
                    assetRegistry.update(asset);
                    return Promise.resolve();
                });
        })
        .then(function () {
            return getParticipantRegistry('org.meerkat.net.BizEntity')
                .then(
                    function (ar) {
                        assetRegistry1 = ar;
                        return assetRegistry1.get(acceptInvoiceTransaction.invoice.sender.bizEntityId);
                    }
                )
                .then(function (asset) {
                    asset.claim = asset.claim + acceptInvoiceTransaction.invoice.amount;
                    return assetRegistry1.update(asset);
                    return Promise.resolve();
                })
                .then(
                    function () {
                        return assetRegistry1.get(acceptInvoiceTransaction.invoice.receiver.bizEntityId);
                    }
                )
                .then(function (asset) {
                    asset.debt = asset.debt + acceptInvoiceTransaction.invoice.amount;
                    return assetRegistry1.update(asset);
                    return Promise.resolve();
                });
        });
}

/**
 * Create invoice transaction
 * @param {org.meerkat.net.CreateInvoice} createInvoiceTransaction
 * @transaction
 */
function onCreateInvoice(createInvoiceTransaction) {
    return getAssetRegistry('org.meerkat.net.Invoice')
        .then(function (ar) {
            var factory = getFactory();
            var newInvoice = factory.newResource("org.meerkat.net", "Invoice", createInvoiceTransaction.sender.bizEntityId + "_" + createInvoiceTransaction.invoiceId);
            newInvoice.amount = createInvoiceTransaction.amount;
            newInvoice.receiver = createInvoiceTransaction.receiver;
            newInvoice.sender = createInvoiceTransaction.sender;
            newInvoice.status = "NEW";

            var basicEvent = factory.newEvent('org.meerkat.net', 'InvoiceCreatedEvent');
            basicEvent.state = "NEW";
            basicEvent.receiverId = "r";
            basicEvent.senderId = "s";

            emit(basicEvent);

            return ar.add(newInvoice);
        })
        .catch(function (err) {
            throw new Error(err);
        })
}

/**
 * Pay invoice transaction
 * @param {org.meerkat.net.PayInvoice} payInvoiceTransaction
 * @transaction
 */
function onPayInvoice(payInvoiceTransaction) {
    var assetRegistry;
    if (payInvoiceTransaction.sender.bizEntityId !== payInvoiceTransaction.invoice.receiver.bizEntityId) {
        throw new Error("Only receiver of transaction can pay transaction");
    }
    return getAssetRegistry('org.meerkat.net.Invoice')
        .then(function (ar) {
            assetRegistry = ar;
            return assetRegistry.get(payInvoiceTransaction.invoice.invoiceId);
        })
        .then(function (asset) {
            asset.status = "PAID";
            return assetRegistry.update(asset);
        })
        .catch(function (err) {
            throw new Error(err);
        });
}

/**
 * Pay invoice transaction
 * @param {org.meerkat.net.RejecetInvoice} rejectInvoiceTransaction
 * @transaction
 */
function onRejectInvoice(rejectInvoiceTransaction) {
    var assetRegistry;
    if (rejectInvoiceTransaction.sender.bizEntityId !== rejectInvoiceTransaction.invoice.receiver.bizEntityId) {
        throw new Error("Only receiver of transaction can reject transaction");
    }
    return getAssetRegistry('org.meerkat.net.Invoice')
        .then(function (ar) {
            assetRegistry = ar;
            return assetRegistry.get(rejectInvoiceTransaction.invoice.invoiceId);
        })
        .then(function (asset) {
            asset.status = "REJECTED";
            return assetRegistry.update(asset);
        })
        .catch(function (err) {
            throw new Error(err);
        });
}

/**
 * Pay invoice transaction
 * @param {org.meerkat.net.ConfirmPaidInvoice} confirmPaidInvoiceTransaction
 * @transaction
 */
function onConfirmPaidInvoice(confirmPaidInvoiceTransaction) {
    var assetRegistry;
    var assetRegistry1;

    if (confirmPaidInvoiceTransaction.sender.bizEntityId !== confirmPaidInvoiceTransaction.invoice.sender.bizEntityId) {
        throw new Error("Only sender of transaction can confirm transaction paid");
    }

    return Promise.resolve()
        .then(function () {
            getAssetRegistry('org.meerkat.net.Invoice')
                .then(function (ar) {
                    assetRegistry = ar;
                    return assetRegistry.get(confirmPaidInvoiceTransaction.invoice.invoiceId);
                })
                .then(function (asset) {
                    asset.status = "COMPLETED";
                    assetRegistry.update(asset);
                    return Promise.resolve();
                });
        })
        .then(function () {
            return getParticipantRegistry('org.meerkat.net.BizEntity')
                .then(
                    function (ar) {
                        assetRegistry1 = ar;
                        return assetRegistry1.get(confirmPaidInvoiceTransaction.invoice.sender.bizEntityId);
                    }
                )
                .then(function (asset) {
                    asset.claim = asset.claim - confirmPaidInvoiceTransaction.invoice.amount;
                    return assetRegistry1.update(asset);
                    return Promise.resolve();
                })
                .then(
                    function () {
                        return assetRegistry1.get(confirmPaidInvoiceTransaction.invoice.receiver.bizEntityId);
                    }
                )
                .then(function (asset) {
                    asset.debt = asset.debt - confirmPaidInvoiceTransaction.invoice.amount;
                    return assetRegistry1.update(asset);
                    return Promise.resolve();
                });
        });
}

/**
 * Pay invoice transaction
 * @param {org.meerkat.net.BizEntityInvoices} bizEntityInvoicesTransaction
 * @transaction
 */
function onBizEntityInvoices(bizEntityInvoicesTransaction) {
    return getAssetRegistry('org.meerkat.net.Invoice')
    .then(function() {
        return query('selectInvoicesForUserSender')
        .then(function(results){
            return results;
        });
    });

}