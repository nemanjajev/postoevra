'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.meerkat.net.AcceptInvoice} acceptInvoiceTransaction
 * @transaction
 */
function onAcceptInvoice(acceptInvoiceTransaction) {
    let assetRegistry;
    let id = acceptInvoiceTransaction.invoiceId;

    if(acceptInvoiceTransaction.sender.bizEntityId !== acceptInvoiceTransaction.invoice.receiver.bizEntityId) {
        throw new Error("Only receiver of transaction can accept transaction");
    }
    return getAssetRegistry('org.meerkat.net.Invoice')
        .then(function(ar) {
            assetRegistry = ar;
            return assetRegistry.get(id);
        })
        .then(function(asset) {
            asset.status = acceptInvoiceTransaction.newStatus;
            return assetRegistry.update(asset);
        });
}

/**
 * Sample transaction
 * @param {org.meerkat.net.CreateInvoice} createInvoiceTransaction
 * @transaction
 */
function onCreateInvoice(createInvoiceTransaction) {
    return getAssetRegistry('org.meerkat.net.Invoice')
        .then(function(ar) {
            let factory = getFactory();
            let newInvoice = factory.newResource("org.meerkat.net", "Invoice", `${createInvoiceTransaction.sender.bizEntityId}_${createInvoiceTransaction.invoiceId}`);
            newInvoice.amount = createInvoiceTransaction.amount;
            newInvoice.receiver = createInvoiceTransaction.receiver;
            newInvoice.sender = createInvoiceTransaction.sender;

            return ar.add(newInvoice);
        })
        .catch(function(err){
            throw new Error(err);
        })
}