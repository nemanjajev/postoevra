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
    var event;
    
    if (acceptInvoiceTransaction.sender.bizEntityId !== acceptInvoiceTransaction.invoice.receiver.bizEntityId) {
        throw new Error("Only receiver of transaction can accept transaction");
    }

    var factory = getFactory();
    event = factory.newEvent('org.meerkat.net', 'InvoiceUpdatedEvent');
    event.oldState = "NEW";
    event.newState = "ACCEPTED";
    event.receiverId = acceptInvoiceTransaction.invoice.sender.bizEntityId;
    event.senderId = acceptInvoiceTransaction.invoice.receiver.bizEntityId;
    event.invoiceId = acceptInvoiceTransaction.invoice.invoiceId;

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
        })
        .then(function(){
            var factory = getFactory();
            emit(event);
        });
}

/**
 * Create invoice transaction
 * @param {org.meerkat.net.CreateInvoice} createInvoiceTransaction
 * @transaction
 */
function onCreateInvoice(createInvoiceTransaction) {
    var event;
    return getAssetRegistry('org.meerkat.net.Invoice')
        .then(function (ar) {
            var factory = getFactory();
            var newInvoice = factory.newResource("org.meerkat.net", "Invoice", createInvoiceTransaction.sender.bizEntityId + "_" + createInvoiceTransaction.invoiceId);
            newInvoice.amount = createInvoiceTransaction.amount;
            newInvoice.receiver = createInvoiceTransaction.receiver;
            newInvoice.sender = createInvoiceTransaction.sender;
            newInvoice.status = "NEW";

            event = factory.newEvent('org.meerkat.net', 'InvoiceUpdatedEvent');
            event.oldState = "NEW";
            event.newState = "NEW";
            event.receiverId = createInvoiceTransaction.receiver.bizEntityId;
            event.senderId = createInvoiceTransaction.sender.bizEntityId;
            event.invoiceId = createInvoiceTransaction.invoiceId;


            return ar.add(newInvoice);
        })
        .then(function(){
            var factory = getFactory();
            emit(event);
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

    var event;
    var factory = getFactory();
    event = factory.newEvent('org.meerkat.net', 'InvoiceUpdatedEvent');
    event.oldState = "ACCEPTED";
    event.newState = "PAID";
    event.receiverId = payInvoiceTransaction.invoice.sender.bizEntityId;
    event.senderId = payInvoiceTransaction.invoice.receiver.bizEntityId;
    event.invoiceId = payInvoiceTransaction.invoice.invoiceId;

    return getAssetRegistry('org.meerkat.net.Invoice')
        .then(function (ar) {
            assetRegistry = ar;
            return assetRegistry.get(payInvoiceTransaction.invoice.invoiceId);
        })
        .then(function (asset) {
            asset.status = "PAID";
            return assetRegistry.update(asset);
        })
        .then(function(){
            var factory = getFactory();
            emit(event);
        })
        .catch(function (err) {
            throw new Error(err);
        });
}

/**
 * Pay invoice transaction
 * @param {org.meerkat.net.RejectInvoice} rejectInvoiceTransaction
 * @transaction
 */
function onRejectInvoice(rejectInvoiceTransaction) {
    var assetRegistry;
    if (rejectInvoiceTransaction.sender.bizEntityId !== rejectInvoiceTransaction.invoice.receiver.bizEntityId) {
        throw new Error("Only receiver of transaction can reject transaction");
    }

    var event;
    var factory = getFactory();
    event = factory.newEvent('org.meerkat.net', 'InvoiceUpdatedEvent');
    event.oldState = "NEW";
    event.newState = "REJECTED";
    event.receiverId = rejectInvoiceTransaction.invoice.sender.bizEntityId;
    event.senderId = rejectInvoiceTransaction.invoice.receiver.bizEntityId;
    event.invoiceId = rejectInvoiceTransaction.invoice.invoiceId;

    return getAssetRegistry('org.meerkat.net.Invoice')
        .then(function (ar) {
            assetRegistry = ar;
            return assetRegistry.get(rejectInvoiceTransaction.invoice.invoiceId);
        })
        .then(function (asset) {
            asset.status = "REJECTED";
            return assetRegistry.update(asset);
        })
        .then(function(){
            var factory = getFactory();
            emit(event);
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

    var event;
    var factory = getFactory();
    event = factory.newEvent('org.meerkat.net', 'InvoiceUpdatedEvent');
    event.oldState = "PAID";
    event.newState = "COMPLETED";
    event.receiverId = confirmPaidInvoiceTransaction.invoice.receiver.bizEntityId;
    event.senderId = confirmPaidInvoiceTransaction.invoice.sender.bizEntityId;
    event.invoiceId = confirmPaidInvoiceTransaction.invoice.invoiceId;

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
        })
        .then(function(){
            var factory = getFactory();
            emit(event);
        });
}

/**
 * Pay invoice transaction
 * @param {org.meerkat.net.BizEntityInvoices} bizEntityInvoicesTransaction
 * @transaction
 */
function onBizEntityInvoices(bizEntityInvoicesTransaction) {
    return getAssetRegistry('org.meerkat.net.Invoice')
    .then(function(ar) {
        return query('selectInvoicesForUserSender',{ entityId: "org.meerkat.net.BizEntity#1" })
        .then(function(results){
            return results;
        });
    });

}

/**
 * Request grant transaction
 * @param {org.meerkat.net.CreateAccessRequest} createAccessRequestTransaction
 * @transaction
 */
function onCreateAccessRequest(createAccessRequestTransaction) {
    var event;
    var assetRegistry;
    var factory = getFactory();
    event = factory.newEvent('org.meerkat.net', 'AccessRequestEvent');
    event.senderId = createAccessRequestTransaction.sender.bizEntityId;
    event.receiverId = createAccessRequestTransaction.receiver.bizEntityId;

    return getAssetRegistry('org.meerkat.net.AccessGrant')
        .then(function (ar) {
            assetRegistry = ar;
            return assetRegistry.get(createAccessRequestTransaction.receiver.bizEntityId);
        })
        .then(function (asset) {
            asset.requested = createAccessRequestTransaction.sender;
            return assetRegistry.update(asset);
        })
        .then(function(){
            var factory = getFactory();
            emit(event);
        })
        .catch(function (err) {
            throw new Error(err);
        });
}

/**
 * Accept grant request transaction
 * @param {org.meerkat.net.RespondAccessRequest} respondAccessRequestTransaction
 * @transaction
 */
function onRespondAccessRequest(respondAccessRequestTransaction) {
    var event;
    var assetRegistry;
    var factory = getFactory();
    event = factory.newEvent('org.meerkat.net', 'AccessRequestEvent');
    event.receiverId = "bla?";
    
    return getAssetRegistry('org.meerkat.net.AccessGrant')
        .then(function (ar) {
            assetRegistry = ar;
            return assetRegistry.get(respondAccessRequestTransaction.sender.bizEntityId);
        })
        .then(function (asset) {
            event.senderId = respondAccessRequestTransaction.sender.bizEntityId;
            event.receiverId = "3";
            asset.granted = asset.requested;
            return assetRegistry.update(asset);
        })
        .then(function () {
            var factory = getFactory();
            emit(event);
        })
        .catch(function (err) {
            throw new Error(err);
        });
}